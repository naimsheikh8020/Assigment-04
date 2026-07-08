import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100),

    email: z
      .string()
      .trim()
      .email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),

    phone: z
      .string()
      .optional(),

    avatar: z
      .string()
      .url()
      .optional(),

    role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});