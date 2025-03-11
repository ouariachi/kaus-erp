import { BusinessUserRole, Modules } from "@prisma/client";
import { z } from "zod";

export const addUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .email("Invalid email format"),

  role: z
    .nativeEnum(BusinessUserRole, {
      required_error: "Role is required",
      invalid_type_error: "Invalid role",
    })
    .optional()
    .default(BusinessUserRole.USER),

  modules: z
    .nativeEnum(Modules, {
      required_error: "Modules is required",
      invalid_type_error: "Invalid modules",
    })
    .optional(),
});
