import { z } from "zod";

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([
      "CONFIRMED",
      "PICKED_UP",
      "RETURNED",
      "COMPLETED",
      "CANCELLED",
    ]),
  }),
});

export const OrderValidation = {
  updateOrderStatusValidationSchema,
};