import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalOrderId: z.string().uuid(),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
};