import { z } from "zod";

const getAllGearValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    searchTerm: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    isAvailable: z.string().optional(),
  }),
});

export const GearValidation = {
  getAllGearValidationSchema,
};