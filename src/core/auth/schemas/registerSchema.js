import { z } from "zod";

export const registerSchema = z.object({
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
  firstname: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name is invalid",
    })
    .trim(),
  lastname: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name is invalid",
    })
    .trim(),
});
