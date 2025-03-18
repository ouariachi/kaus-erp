import { getBusinessUserById } from "#src/models/BusinessUser";
import { businessExists } from "#src/services/business/validate";
import { parseIdParam } from "#src/utils/parseIdParam";

/** @type {import("express").RequestHandler} */
export async function deleteBusinessUserExistsMiddleware(req, res, next) {
  req.businessId = parseIdParam(req, res);
  req.userId = parseIdParam(req, res , "userId");

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
