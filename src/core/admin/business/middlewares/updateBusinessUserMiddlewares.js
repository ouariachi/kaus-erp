import { getBusinessUserById } from "#src/models/BusinessUser";
import { businessExists } from "#src/services/business/validate";
import { getZodErrors } from "#src/utils/error";
import { parseIdParam } from "#src/utils/parseIdParam";
import { updateBusinessUserSchema } from "../schemas/updateBusinessUserSchema.js";

export async function updateBusinessUserValidationDataMiddleware(req, res, next) {
  const id = parseIdParam(req, res);
  if (!id) {
    return;
  }

  const userId = parseIdParam(req, res, "userId");
  if (!userId) {
    return;
  }
  
  const updateBusinessUserSchemaResult = updateBusinessUserSchema.safeParse(req.body);
  if (!updateBusinessUserSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(updateBusinessUserSchemaResult.error) });
  }
  
  req.businessId = id;
  req.userId = userId;
  req.validatedData = updateBusinessUserSchemaResult.data;
  next();
}

/** @type {import("express").RequestHandler} */
export async function updateBusinessUserExistsMiddleware(req, res, next) {
  if (!(await businessExists({ id: req.businessId }))) {
    return res.status(400).json({ message: "Business does not exist" });
  }

  const businessUser = await getBusinessUserById(req.userId);
  if (!businessUser) {
    return res.status(404).json({ message: "Business user does not exist" });
  }

  if (businessUser.businessId !== req.businessId) {
    return res.status(400).json({ message: "Business user does not belong to this business" });
  }
  
  next();
}
