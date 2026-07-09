import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    rentalOrderItemId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(5).max(500),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(5).max(500).optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};