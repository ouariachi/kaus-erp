import { registerSchema } from "../schemas/registerSchema.js";
import { getZodErrors } from "#src/utils/error";
import { getBusinessByAllowedDomains, getBusinessByAllowedEmails } from "#src/services/business/validate";
import { respondWithEmailRegistrationFailure } from "#src/utils/auth/register";

export async function validateRegistrationDataMiddleware(req, res, next) {
  const registerSchemaResult = registerSchema.safeParse(req.body);

  if (!registerSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(registerSchemaResult.error) });
  }

  req.validatedData = registerSchemaResult.data;
  next();
}

export async function validateAllowedEmailMiddleware(req, res, next) {
  const email = req.validatedData.email;
  const domain = email.split("@")[1].toLowerCase();
  
  const [businessByDomain, businessByEmail] = await Promise.all([
    getBusinessByAllowedDomains(domain),
    getBusinessByAllowedEmails(email),
  ]);

  if (businessByDomain || businessByEmail || domain === process.env.EMAIL_DOMAIN) {
    return next();
  }
  
  return respondWithEmailRegistrationFailure(res);
}


