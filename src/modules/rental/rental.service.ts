import { Prisma } from "../../../generated/prisma/client";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/AppError";

import { TCreateRental, TGetRentalQuery } from "./rental.interface";

const createRental = async (customerId: string, payload: TCreateRental) => {
  const { startDate, endDate, items } = payload;

  // Validate rental dates
  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "End date must be after start date",
    );
  }

  // Calculate rental days
  const rentalDays = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (rentalDays <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid rental duration");
  }

  let totalAmount = new Prisma.Decimal(0);

  // Fetch all gear items at once
  const gearIds = items.map((item) => item.gearItemId);

  const gears = await prisma.gearItem.findMany({
    where: {
      id: { in: gearIds },
    },
  });

  // Check that all gears belong to the same provider
  const providerIds = new Set(gears.map((gear) => gear.providerId));

  if (providerIds.size > 1) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A rental order can contain gear from only one provider.",
    );
  }

  // Create a map for O(1) lookup
  const gearMap = new Map(gears.map((gear) => [gear.id, gear]));

  const orderItems: {
    gearItemId: string;
    quantity: number;
    pricePerDay: Prisma.Decimal;
    subtotal: Prisma.Decimal;
  }[] = [];

  for (const item of items) {
    const gear = gearMap.get(item.gearItemId);

    if (!gear) {
      throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
    }

    if (!gear.isAvailable) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `${gear.name} is currently unavailable`,
      );
    }

    if (gear.availableStock < item.quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Only ${gear.availableStock} item(s) available for ${gear.name}`,
      );
    }

    const subtotal = gear.pricePerDay.mul(rentalDays * item.quantity);

    totalAmount = totalAmount.add(subtotal);

    orderItems.push({
      gearItemId: gear.id,
      quantity: item.quantity,
      pricePerDay: gear.pricePerDay,
      subtotal,
    });
  }

  // Create Rental Order
  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      customerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      subtotal: totalAmount,
      totalAmount,
    },
  });

  // Create Rental Order Items
  await prisma.rentalOrderItem.createMany({
    data: orderItems.map((item) => ({
      rentalOrderId: rentalOrder.id,
      gearItemId: item.gearItemId,
      quantity: item.quantity,
      pricePerDay: item.pricePerDay,
      subtotal: item.subtotal,
    })),
  });

  // Update Gear Stock
  for (const item of orderItems) {
    const gear = gearMap.get(item.gearItemId);

    if (!gear) {
      throw new AppError(StatusCodes.NOT_FOUND, "Gear not found");
    }

    const availableStock = gear.availableStock - item.quantity;

    await prisma.gearItem.update({
      where: {
        id: item.gearItemId,
      },
      data: {
        availableStock,
        isAvailable: availableStock > 0,
      },
    });
  }

  return await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrder.id,
    },
    include: {
      items: {
        include: {
          gearItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
};

const getMyRentals = async (customerId: string, query: TGetRentalQuery) => {
  const { page = "1", limit = "10", status } = query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const skip = (currentPage - 1) * currentLimit;

  const where: any = {
    customerId,
  };

  if (status) {
    where.status = status;
  }

  const rentals = await prisma.rentalOrder.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          gearItem: {
            include: {
              category: true,
            },
          },
        },
      },
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
    data: rentals,
  };
};

const getRentalDetails = async (customerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      items: {
        include: {
          gearItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental order not found");
  }

  return rental;
};

export const RentalService = {
  createRental,
  getMyRentals,
  getRentalDetails,
};
