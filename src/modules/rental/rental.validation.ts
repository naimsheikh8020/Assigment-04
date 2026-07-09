import { z } from "zod";

const rentalItemSchema = z.object({
  gearItemId: z.string().uuid("Invalid gear item id"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1"),
});

const createRentalValidationSchema = z.object({
  body: z.object({
    startDate: z.coerce.date({
      error: "Invalid start date",
    }),

    endDate: z.coerce.date({
      error: "Invalid end date",
    }),

    items: z
      .array(rentalItemSchema)
      .min(1, "At least one gear item is required"),
  }),
});

export const RentalValidation = {
  createRentalValidationSchema,
};