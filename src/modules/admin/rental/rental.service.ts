import { Prisma } from "../../../../generated/prisma/client.js";

import { prisma } from "../../../config/prisma.js";

import { TGetRentalQuery } from "./rental.interface.js";

const getAllRentals = async (query: TGetRentalQuery) => {
  const {
    page = "1",
    limit = "10",
    status,
  } = query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const skip = (currentPage - 1) * currentLimit;

  const where: Prisma.RentalOrderWhereInput = {};

  if (status) {
    where.status = status as any;
  }

  const rentals = await prisma.rentalOrder.findMany({
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
        },
      },

      items: {
        include: {
          gearItem: {
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
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
      totalPages: Math.ceil(total / currentLimit),
    },
    data: rentals,
  };
};

export const RentalService = {
  getAllRentals,
};