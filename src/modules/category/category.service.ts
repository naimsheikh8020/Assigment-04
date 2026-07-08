import slugify from "slugify";

import { prisma } from "../../config/prisma";
import { TCreateCategory, TUpdateCategory } from "./category.interface";

const createCategory = async (payload: TCreateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
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
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
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
    throw new Error("Category not found");
  }

  const data: any = {
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
    throw new Error("Category not found");
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