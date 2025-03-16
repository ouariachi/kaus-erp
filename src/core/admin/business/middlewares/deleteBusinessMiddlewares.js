import { businessExists } from "#src/services/business/validate";
import { isSuperAdmin } from "#src/utils/auth/userRole";
import { parseIdParam } from "#src/utils/parseIdParam";

/** @type {import("express").RequestHandler} */
export async function deleteBusinessAccessMiddleware(req, res, next) {
  if (!isSuperAdmin(req.session.user)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function deleteBusinessExistsMiddleware(req, res, next) {
  req.businessId = parseIdParam(req, res);
  if (!(await businessExists({ id: req.businessId }))) {
    return res.status(400).json({ message: "Business does not exist" });
  }
  next();
}