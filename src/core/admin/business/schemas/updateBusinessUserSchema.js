import { addBusinessUserSchema } from "./addBusinessUserSchema.js";

export const updateBusinessUserSchema = addBusinessUserSchema.omit({
  email: true,
}).partial();