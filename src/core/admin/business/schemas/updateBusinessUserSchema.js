import { z } from "zod";
import { addBusinessUserSchema } from "./addBusinessUserSchema.js";
import { BusinessUserStatus } from "@prisma/client";

export const updateBusinessUserSchema = addBusinessUserSchema.omit({
  email: true,
}).extend({
  status: z
    .nativeEnum(BusinessUserStatus, {
      invalid_type_error: "Invalid status",
    })
    .optional()
}).partial();