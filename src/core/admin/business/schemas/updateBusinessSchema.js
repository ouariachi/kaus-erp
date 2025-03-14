import { createBusinessSchema } from "./createBusinessSchema.js";
export const updateBusinessSchemaSuperAdmin = createBusinessSchema.partial();
export const updateBusinessSchemaAdmin = updateBusinessSchemaSuperAdmin.omit({
  nif: true,
  email: true,
  emailDomains: true,
});
