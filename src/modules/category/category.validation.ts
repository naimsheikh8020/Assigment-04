import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: "Category name is required",
      })
      .trim()
      .min(2)
      .max(50),

    description: z
      .string()
      .trim()
      .optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .optional(),

    description: z
      .string()
      .trim()
      .optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};