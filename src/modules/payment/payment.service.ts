// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma";
import config from "../../config";
import axios from "axios";

import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";

import { AppError } from "../../middlewares/AppError";
import { Prisma } from "../../../generated/prisma/client";
import { TGetPaymentQuery } from "./payment.interface";

const initiatePayment = async (customerId: string, rentalOrderId: string) => {
  const sslcz = new SSLCommerzPayment(
    config.ssl_store_id,
    config.ssl_store_password,
    config.ssl_is_live,
  );

  // Check rental exists
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
      customer: true,
    },
  });

  if (!rental) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental order not found");
  }

  // Check owner
  if (rental.customerId !== customerId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access");
  }

  // Rental must be confirmed
  if (rental.status !== RentalStatus.CONFIRMED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Rental must be confirmed before payment",
    );
  }

  // Already paid?
  const existingPayment = await prisma.payment.findFirst({
    where: {
      rentalOrderId,
      status: PaymentStatus.COMPLETED,
    },
  });

  if (existingPayment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment already completed");
  }

  // Generate Transaction ID
  const transactionId = uuidv4();

  // Save Pending Payment
  await prisma.payment.create({
    data: {
      rentalOrderId,
      transactionId,
      provider: PaymentProvider.SSLCOMMERZ,
      amount: rental.totalAmount,
      status: PaymentStatus.PENDING,
    },
  });

  // SSLCommerz Payload
  const paymentData = {
    total_amount: Number(rental.totalAmount),
    currency: "BDT",

    tran_id: transactionId,

    success_url: `${config.backend_url}/api/v1/payments/success?rentalOrderId=${rental.id}&transactionId=${transactionId}`,

    fail_url: `${config.backend_url}/api/v1/payments/fail?rentalOrderId=${rental.id}&transactionId=${transactionId}`,

    cancel_url: `${config.backend_url}/api/v1/payments/cancel?rentalOrderId=${rental.id}&transactionId=${transactionId}`,

    ipn_url: `${config.backend_url}/api/v1/payments/ipn`,

    shipping_method: "NO",

    product_name: "Sports Gear Rental",
    product_category: "Rental",
    product_profile: "general",

    cus_name: rental.customer.name,
    cus_email: rental.customer.email,
    cus_add1: "Dhaka",
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1207",
    cus_country: "Bangladesh",
    cus_phone: rental.customer.phone || "01700000000",
    cus_fax: "N/A",

    ship_name: rental.customer.name,
    ship_add1: "Dhaka",
    ship_add2: "N/A",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1207",
    ship_country: "Bangladesh",
  };

  const response = await sslcz.init(paymentData);
  console.log(response);

  if (!response?.GatewayPageURL) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to initialize payment");
  }

  return {
    gatewayURL: response.GatewayPageURL,
  };
};

const validatePayment = async (
  rentalOrderId: string,
  transactionId: string,
  status: string,
  payload: Record<string, any>,
) => {
  const validationURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_password}&format=json`;

  const response = await axios.get(validationURL);

  const data = response.data;

  if (data.status === "VALID" || data.status === "VALIDATED") {
    await prisma.payment.update({
      where: {
        transactionId,
      },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await prisma.rentalOrder.update({
      where: {
        id: rentalOrderId,
      },
      data: {
        status: RentalStatus.PAID,
      },
    });
  } else {
    await prisma.payment.update({
      where: {
        transactionId,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });
  }

  return status;
};

const successPayment = async (
  rentalOrderId: string,
  transactionId: string,
  payload: Record<string, any>,
) => {
  return await validatePayment(
    rentalOrderId,
    transactionId,
    "success",
    payload,
  );
};

const failPayment = async (transactionId: string) => {
  await prisma.payment.update({
    where: {
      transactionId,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  return "fail";
};
const cancelPayment = async (transactionId: string) => {
  await prisma.payment.update({
    where: {
      transactionId,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  return "cancel";
};

const getPaymentHistory = async (
  customerId: string,
  query: TGetPaymentQuery,
) => {
  const { page = "1", limit = "10" } = query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 10, 1);

  const skip = (currentPage - 1) * currentLimit;

  const where: Prisma.PaymentWhereInput = {
    rentalOrder: {
      customerId,
    },
  };

  const payments = await prisma.payment.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      rentalOrder: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          totalAmount: true,
          status: true,
        },
      },
    },
  });

  const total = await prisma.payment.count({
    where,
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
    },
    data: payments,
  };
};

export const PaymentService = {
  initiatePayment,
  validatePayment,
  successPayment,
  failPayment,
  cancelPayment,
  getPaymentHistory,
};
