import { getUserByEmail } from "#src/models/User";
import { businessExists } from "#src/services/business/validate";
import { isAdmin } from "#src/utils/auth/userRole";
import { getZodErrors } from "#src/utils/error";
import { parseIdParam } from "#src/utils/parseIdParam";
import { addUserSchema } from "../schemas/addUserSchema.js";

/** @type {import("express").RequestHandler} */
export async function addUserValidationDataMiddleware(req, res, next) { 
  const id = parseIdParam(req, res);
  if (!id) {
    return;
  }
  req.businessId = id;

  const addUserSchemaResult = addUserSchema.safeParse(req.body);
  if(!addUserSchemaResult.success) {
    return res.status(400).json({ errors: getZodErrors(addUserSchemaResult.error) });
  }

  req.validatedData = addUserSchemaResult.data;
  next();
}

/** @type {import("express").RequestHandler} */
export async function addUserBusinessExistsMiddleware(req, res, next) {
  if (!await businessExists({ id: req.businessId })) {
    return res.status(400).json({ message: 'Business does not exist' });
  }
  next();
}

/** @type {import("express").RequestHandler} */
export async function addUserUserExistsMiddleware(req, res, next) {
  const { email } = req.validatedData;
  const user = await getUserByEmail(email, { Businesses: true });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  if (user.Businesses.length > 0) {
    const business = user.Businesses.filter(b => b.businessId === req.businessId);
    if (business.length > 0) {
      return res.status(409).json({ message: 'User already exists in this business' });
    }
  }

  next();
}