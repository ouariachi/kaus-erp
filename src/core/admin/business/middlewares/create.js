import { businessExists } from "#src/services/business/validate";
import { isSuperAdmin } from "#src/utils/auth/userRole";
import { verifyDomain } from "#src/utils/email/verifyDomain";
import { getZodErrors } from "#src/utils/error";
import { createSchema } from "../schemas/createSchema.js";

/** @type {import("express").RequestHandler} */
export async function createAccessMiddleware(req, res, next) { 
  if(!isSuperAdmin(req.session.user)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function createValidationDataMiddleware(req, res, next) { 
  if (req.body.emailDomains && typeof req.body.emailDomains === 'string') {
    req.body.emailDomains = req.body.emailDomains.split(',');
  }

  if (req.body.allowedEmails && typeof req.body.allowedEmails === 'string') {
    req.body.allowedEmails = req.body.allowedEmails.split(',');
  }

  const createSchemaResult = createSchema.safeParse(req.body);
  if(!createSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(createSchemaResult.error) });
  }

  for (const domain of createSchemaResult.data.emailDomains) {
    const isValid = await verifyDomain(domain);
    if (!isValid) {
      return res.status(400).json({ message: `Invalid email domain: ${domain}` });
    }
  }

  req.validatedData = createSchemaResult.data;
  next();
}

/** @type {import("express").RequestHandler}  */
export async function createUniqueMiddleware(req, res, next) {
  if(await businessExists(req.validatedData)) {
    return res.status(409).json({ message: 'Business already exists' });
  }

  next();
}