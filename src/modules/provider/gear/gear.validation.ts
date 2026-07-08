import { z } from "zod";

const createGearValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid("Invalid category id"),

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100),

    brand: z
      .string()
      .min(2, "Brand must be at least 2 characters")
      .max(100),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    image: z.string().url("Invalid image URL").optional(),

    pricePerDay: z
      .number()
      .positive("Price per day must be greater than 0"),

    totalStock: z
      .number()
      .int()
      .min(1, "Stock must be at least 1"),

    condition: z.enum(
      ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"],
      {
        error: "Invalid gear condition",
      }
    ),
  }),
});

const updateGearValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional(),

    name: z.string().min(2).max(100).optional(),

    brand: z.string().min(2).max(100).optional(),

    description: z.string().min(10).optional(),

    image: z.string().url().optional(),

    pricePerDay: z.number().positive().optional(),

    totalStock: z.number().int().min(1).optional(),

    condition: z
      .enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"])
      .optional(),
  }),
});

export const GearValidation = {
  createGearValidationSchema,
  updateGearValidationSchema,
};