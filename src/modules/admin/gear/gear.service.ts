import { Prisma } from "../../../../generated/prisma/client.js";

import { prisma } from "../../../config/prisma.js";

import { TGetGearQuery } from "./gear.interface.js";

const getAllGear = async (query: TGetGearQuery) => {
  const {
    page = "1",
    limit = "10",
    searchTerm,
    category,
    brand,
    isAvailable,
  } = query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const skip = (currentPage - 1) * currentLimit;

  const where: Prisma.GearItemWhereInput = {};

  if (searchTerm) {
    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (brand) {
    where.brand = brand;
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === "true";
  }

  const gears = await prisma.gearItem.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy: {
      createdAt: "desc",
    },
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
  });

  const total = await prisma.gearItem.count({
    where,
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
    },
    data: gears,
  };
};

export const GearService = {
  getAllGear,
};