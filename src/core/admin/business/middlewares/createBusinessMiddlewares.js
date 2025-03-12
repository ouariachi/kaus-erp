import { businessExists } from "#src/services/business/validate";
import { isSuperAdmin } from "#src/utils/auth/userRole";
import { verifyDomain } from "#src/utils/email/verifyDomain";
import { getZodErrors } from "#src/utils/error";
import { parseStringArrays } from "#src/utils/parseStringArrays";
import { createBusinessSchema } from "../schemas/createBusinessSchema.js";

/** @type {import("express").RequestHandler} */
export async function createBusinessAccessMiddleware(req, res, next) {
  if (!isSuperAdmin(req.session.user)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function createBusinessValidationDataMiddleware(req, res, next) {
  req.body.emailDomains = parseStringArrays(req.body.emailDomains);
  req.body.allowedEmails = parseStringArrays(req.body.allowedEmails);

  const createBusinessSchemaResult = createBusinessSchema.safeParse(req.body);
  if (!createBusinessSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(createBusinessSchemaResult.error) });
  }

  for (const domain of createBusinessSchemaResult.data.emailDomains) {
    const isValid = await verifyDomain(domain);
    if (!isValid) {
      return res.status(400).json({ message: `Invalid email domain: ${domain}` });
    }
  }

  req.validatedData = createBusinessSchemaResult.data;
  next();
}

/** @type {import("express").RequestHandler}  */
export async function createBusinessUniqueMiddleware(req, res, next) {
  if (await businessExists(req.validatedData)) {
    return res.status(409).json({ message: "Business already exists" });
  }

  next();
}
