import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(20, "Phone number is too long")
      .optional(),

    avatar: z
      .string()
      .url("Avatar must be a valid URL")
      .optional(),
  }),
});

export const ProfileValidation = {
  updateProfileValidationSchema,
};