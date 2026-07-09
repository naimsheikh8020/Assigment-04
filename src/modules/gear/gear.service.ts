import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/AppError.js";

import { TGetAllGearQuery } from "./gear.interface.js";

const getAllGear = async (query: TGetAllGearQuery) => {
  const {
    search,
    categoryId,
    brand,
    minPrice,
    maxPrice,
    isAvailable,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const skip = (currentPage - 1) * currentLimit;

  const where: any = {};

  // Search
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Category Filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Brand Filter
  if (brand) {
    where.brand = {
      contains: brand,
      mode: "insensitive",
    };
  }

  // Availability Filter
  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === "true";
  }

  // Price Filter
  if (minPrice || maxPrice) {
    where.pricePerDay = {};

    if (minPrice) {
      where.pricePerDay.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.pricePerDay.lte = Number(maxPrice);
    }
  }

  const gears = await prisma.gearItem.findMany({
    where,
    skip,
    take: currentLimit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
    },
    data: gears,
  };
};

const getSingleGear = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: true,
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  return gear;
};

export const GearService = {
  getAllGear,
  getSingleGear,
};