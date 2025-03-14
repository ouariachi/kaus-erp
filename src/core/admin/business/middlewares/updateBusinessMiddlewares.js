import { updateBusinessSchemaAdmin, updateBusinessSchemaSuperAdmin } from "../schemas/updateBusinessSchema.js";  
import { businessExists } from "#src/services/business/validate";
import { isSuperAdmin } from "#src/utils/auth/userRole";
import { verifyDomain } from "#src/utils/email/verifyDomain";
import { getSchemaFieldDifference } from "#src/utils/getSchemaFieldDifference";
import { parseStringArrays } from "#src/utils/parseStringArrays";
import { parseIdParam } from "#src/utils/parseIdParam";
import { getZodErrors } from "#src/utils/error";

/** @type {import("express").RequestHandler} */
export async function updateBusinessAccessMiddleware(req, res, next) {
  if (isSuperAdmin(req.session.user)) {
    req.dataSchema = updateBusinessSchemaSuperAdmin;
  } else {
    req.dataSchema = updateBusinessSchemaAdmin;
    const restrictedFieldsForAdmin = getSchemaFieldDifference(
      updateBusinessSchemaSuperAdmin,
      updateBusinessSchemaAdmin,
    );
    const invalidFields = restrictedFieldsForAdmin.filter((field) => field in req.body);
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "You are not allowed to update the following fields",
        fields: invalidFields,
      });
    }
  }

  next();
}

/** @type {import("express").RequestHandler} */
export async function updateBusinessValidationDataMiddleware(req, res, next) {
  const id = parseIdParam(req, res);
  if (!id) return;
  req.businessId = id;
  req.body.emailDomains = parseStringArrays(req.body.emailDomains);
  req.body.allowedEmails = parseStringArrays(req.body.allowedEmails);

  const updateBusinessSchemaResult = req.dataSchema.safeParse(req.body);
  if (!updateBusinessSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(updateBusinessSchemaResult.error) });
  }

  req.validatedData = updateBusinessSchemaResult.data;

  if (req.validatedData.emailDomains?.length) {
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
  }

  next();
}

/** @type {import("express").RequestHandler} */
export async function updateBusinessExistsMiddleware(req, res, next) {
  if (!(await businessExists({ id: req.businessId }))) {
    return res.status(400).json({ message: "Business does not exist" });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function updateBusinessUniqueMiddleware(req, res, next) {
  if (await businessExists(req.validatedData, req.businessId)) {
    return res.status(409).json({ message: "The provided data conflicts with an existing business." });
  }
  next();
}
