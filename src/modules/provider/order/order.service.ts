import { StatusCodes } from "http-status-codes";
import { Prisma, RentalStatus } from "../../../../generated/prisma/client.js";

import { prisma } from "../../../config/prisma.js";
import { AppError } from "../../../middlewares/AppError.js";

import { TGetOrderQuery, TUpdateOrderStatus } from "./order.interface.js";

const getProviderOrders = async (
  providerId: string,
  query: TGetOrderQuery,
) => {
  const { page = "1", limit = "10", status } = query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 10, 1);

  const skip = (currentPage - 1) * currentLimit;

  const where: Prisma.RentalOrderWhereInput = {
    items: {
      some: {
        gearItem: {
          providerId,
        },
      },
    },
  };

  if (status) {
    where.status = status;
  }

  const orders = await prisma.rentalOrder.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },

      items: {
        where: {
          gearItem: {
            providerId,
          },
        },
        include: {
          gearItem: {
            include: {
              category: true,
            },
          },
        },
      },

      payments: true,
    },
  });

  const total = await prisma.rentalOrder.count({
    where,
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
    },
    data: orders,
  };
};

const validTransitions: Readonly<
  Record<RentalStatus, RentalStatus[]>
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],

  CONFIRMED: [],

  PAID: ["PICKED_UP"],

  PICKED_UP: ["RETURNED"],

  RETURNED: ["COMPLETED"],

  COMPLETED: [],

  CANCELLED: [],
};

const updateOrderStatus = async (
  providerId: string,
  rentalOrderId: string,
  payload: TUpdateOrderStatus,
) => {
  const { status } = payload;

  const order = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Rental order not found",
    );
  }

  if (order.status === status) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Order is already ${status}`,
    );
  }

  const allowedTransitions = validTransitions[order.status];

  if (!allowedTransitions.includes(status)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Cannot change status from ${order.status} to ${status}`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.rentalOrder.update({
      where: {
        id: rentalOrderId,
      },
      data: {
        status,
      },
    });

    await tx.rentalOrderItem.updateMany({
      where: {
        rentalOrderId,
      },
      data: {
        status,
      },
    });
  });

  const updatedOrder = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,

      items: {
        where: {
          gearItem: {
            providerId,
          },
        },
        select: {
          id: true,
          quantity: true,
          status: true,
          subtotal: true,

          gearItem: {
            select: {
              id: true,
              name: true,
              image: true,
              brand: true,
              pricePerDay: true,
            },
          },
        },
      },
    },
  });

  return updatedOrder;
};

export const OrderService = {
  getProviderOrders,
  updateOrderStatus,
};