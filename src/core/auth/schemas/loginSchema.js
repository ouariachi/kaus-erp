import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is invalid",
    })
    .trim()
    .email("Email is invalid"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is invalid",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(/^\S*$/g, "Password must not contain spaces"),
  code: z
    .number({
      required_error: "Code is required",
      invalid_type_error: "Code is invalid",
    })
    .positive("Code must be a positive number")
    .optional(),
});
