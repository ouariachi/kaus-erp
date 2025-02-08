import { registerSchema } from "../schemas/registerSchema.js";
import { getZodErrors } from "../utils/error.js";

export async function registerMiddleware(req, res, next) {
  const registerSchemaResult = registerSchema.safeParse(req.body);

  if (!registerSchemaResult.success) {
    res.status(400).json({ errors: getZodErrors(registerSchemaResult.error) });
    return;
  }

  req.validatedData = registerSchemaResult.data;
  next();
}
