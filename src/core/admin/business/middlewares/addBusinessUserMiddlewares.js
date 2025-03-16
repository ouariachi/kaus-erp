import { getUserByEmail } from "#src/models/User";
import { businessExists } from "#src/services/business/validate";
import { getZodErrors } from "#src/utils/error";
import { parseIdParam } from "#src/utils/parseIdParam";
import { addBusinessUserSchema } from "../schemas/addBusinessUserSchema.js";

/** @type {import("express").RequestHandler} */
export async function addBusinessUserValidationDataMiddleware(req, res, next) {
  const id = parseIdParam(req, res);
  if (!id) {
    return;
  }
  req.businessId = id;

  const addBusinessUserSchemaResult = addBusinessUserSchema.safeParse(req.body);
  if (!addBusinessUserSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(addBusinessUserSchemaResult.error) });
  }

  req.validatedData = addBusinessUserSchemaResult.data;
  next();
}

/** @type {import("express").RequestHandler} */
export async function addBusinessUserBusinessExistsMiddleware(req, res, next) {
  if (!(await businessExists({ id: req.businessId }))) {
    return res.status(400).json({ message: "Business does not exist" });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function addBusinessUserUserExistsMiddleware(req, res, next) {
  const { email } = req.validatedData;
  const user = await getUserByEmail(email, { Businesses: true });
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (user.Businesses.length > 0) {
    const business = user.Businesses.filter((b) => b.businessId === req.businessId);
    if (business.length > 0) {
      return res.status(409).json({ message: "User already exists in this business" });
    }
  }

  next();
}
