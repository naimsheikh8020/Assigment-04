import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: "Name is required",
      })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .email({
        error: "Invalid email address",
      })
      .trim()
      .toLowerCase(),

    password: z
      .string({
        error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),

    phone: z
      .string()
      .trim()
      .optional(),

    avatar: z
      .url("Invalid avatar URL")
      .optional(),

    role: z.enum(["CUSTOMER", "PROVIDER"], {
      error: "Role must be CUSTOMER or PROVIDER",
    }),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: "Invalid email address",
      })
      .trim()
      .toLowerCase(),

    password: z.string({
      error: "Password is required",
    }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};