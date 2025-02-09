import { loginSchema } from "../schemas/loginSchema.js";
import { getZodErrors } from "#src/utils/error";

export async function loginMiddleware(req, res, next) {
  if (req.body.code) {
    req.body.code = Number(req.body.code);
  }

  const loginSchemaResult = loginSchema.safeParse(req.body);
  if (!loginSchemaResult.success) {
    res.status(400).json({ errors: getZodErrors(loginSchemaResult.error) });
    return;
  }

  req.validatedData = loginSchemaResult.data;
  next();
}