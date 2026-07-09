import slugify from "slugify";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../../../config/prisma.js";
import { AppError } from "../../../middlewares/AppError.js";

import {
  TCreateGear,
  TUpdateGear,
} from "./gear.interface.js";

const createGear = async (
  providerId: string,
  payload: TCreateGear
) => {
  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  // Check duplicate gear for the same provider
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      providerId,
      name: payload.name,
    },
  });

  if (existingGear) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Gear already exists"
    );
  }

  // Generate slug
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Create gear
  const result = await prisma.gearItem.create({
    data: {
      providerId,
      categoryId: payload.categoryId,

      name: payload.name,
      slug,

      brand: payload.brand,
      description: payload.description,
      image: payload.image,

      pricePerDay: payload.pricePerDay,

      totalStock: payload.totalStock,
      availableStock: payload.totalStock,

      condition: payload.condition,
      isAvailable: payload.totalStock > 0,
    },
  });

  return result;
};

const updateGear = async (
  providerId: string,
  gearId: string,
  payload: TUpdateGear
) => {
  // Check gear exists
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  // Check ownership
  if (gear.providerId !== providerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to update this gear"
    );
  }

  // Check category exists (if category is changing)
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Category not found"
      );
    }
  }

  const data: any = {
    ...payload,
  };

  // Update slug if name changes
  if (payload.name) {
    data.slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  // Update stock
  if (payload.totalStock !== undefined) {
    data.availableStock =
      gear.availableStock +
      (payload.totalStock - gear.totalStock);

    if (data.availableStock < 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Available stock cannot be negative"
      );
    }

    data.isAvailable = data.availableStock > 0;
  }

  const result = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data,
  });

  return result;
};

const deleteGear = async (
  providerId: string,
  gearId: string
) => {
  // Check gear exists
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  // Check ownership
  if (gear.providerId !== providerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to delete this gear"
    );
  }

  const result = await prisma.gearItem.delete({
    where: {
      id: gearId,
    },
  });

  return result;
};

export const GearService = {
  createGear,
  updateGear,
  deleteGear,
};