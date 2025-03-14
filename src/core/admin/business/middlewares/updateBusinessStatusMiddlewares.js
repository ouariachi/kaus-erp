import { businessExists } from "#src/services/business/validate";
import { isSuperAdmin } from "#src/utils/auth/userRole";
import { getZodErrors } from "#src/utils/error";
import { parseIdParam } from "#src/utils/parseIdParam";
import { updateBusinessStatusSchema } from "../schemas/updateBusinessStatusSchema.js";

/** @type {import("express").RequestHandler} */
export async function updateBusinessStatusAccessMiddleware(req, res, next) {
  if (!isSuperAdmin(req.session.user)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

export async function updateBusinessStatusValidationDataMiddleware(req, res, next) {
  const id = parseIdParam(req, res);
  if (!id) return;
  req.businessId = id;

  const updateBusinessStatusSchemaResult = updateBusinessStatusSchema.safeParse(req.body);
  if (!updateBusinessStatusSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(updateBusinessStatusSchemaResult.error) });
  }

  req.businessStatus = updateBusinessStatusSchemaResult.data.status;
  next();
}

/** @type {import("express").RequestHandler} */
export async function updateBusinessStatusExistsMiddleware(req, res, next) {
  if (!(await businessExists({ id: req.businessId }))) {
    return res.status(400).json({ message: "Business does not exist" });
  }
  next();
}
