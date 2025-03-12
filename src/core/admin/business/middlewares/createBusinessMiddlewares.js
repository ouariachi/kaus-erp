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

  req.validatedData = createBusinessSchemaResult.data;
  
  const domainChecks = await Promise.all(
    req.validatedData.emailDomains.map(async (domain) => ({
      domain,
      isValid: await verifyDomain(domain),
    }))
  );
  const invalidDomains = domainChecks.filter(({ isValid }) => !isValid).map(({ domain }) => domain);
  if (invalidDomains.length > 0) {
    return res.status(400).json({ message: "Invalid email domains", domains: invalidDomains });
  }

  next();
}

/** @type {import("express").RequestHandler}  */
export async function createBusinessUniqueMiddleware(req, res, next) {
  if (await businessExists(req.validatedData)) {
    return res.status(409).json({ message: "Business already exists" });
  }

  next();
}
