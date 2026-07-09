import { z } from "zod";

const getAllRentalValidationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const RentalValidation = {
  getAllRentalValidationSchema,
};