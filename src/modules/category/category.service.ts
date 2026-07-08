import slugify from "slugify";
import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/AppError";

import {
  TCreateCategory,
  TUpdateCategory,
} from "./category.interface";

const createCategory = async (payload: TCreateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Category already exists"
    );
  }

  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const result = await prisma.category.create({
    data: {
      ...payload,
      slug,
    },
  });

  return result;
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: TUpdateCategory
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  const data: TUpdateCategory & { slug?: string } = {
    ...payload,
  };

  if (payload.name) {
    data.slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  return await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};