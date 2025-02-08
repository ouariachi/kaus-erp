import { confirm2FASchema, disable2FASchema, enable2FASchema } from "../schemas/2FASchema.js";
import { getZodErrors } from "../utils/error.js";

export async function enable2FAMiddleware(req, res, next) {
  const enable2FASchemaResult = enable2FASchema.safeParse(req.body);
  if (!enable2FASchemaResult.success) {
    res.status(400).json({ errors: getZodErrors(enable2FASchemaResult.error) });
    return;
  }

  req.validatedData = enable2FASchemaResult.data;
  next();
}

export async function confirm2FAMiddleware(req, res, next) {
  if (req.body.code) {
    req.body.code = Number(req.body.code);
  }

  const confirm2FASchemaResult = confirm2FASchema.safeParse(req.body);
  if (!confirm2FASchemaResult.success) {
    res.status(400).json({ errors: getZodErrors(confirm2FASchemaResult.error) });
    return;
  }

  req.validatedData = confirm2FASchemaResult.data;
  next();
}

export async function disable2FAMiddleware(req, res, next) {
  if (req.body.code) {
    req.body.code = Number(req.body.code);
  }

  const disable2FASchemaResult = disable2FASchema.safeParse(req.body);
  if (!disable2FASchemaResult.success) {
    res.status(400).json({ errors: getZodErrors(disable2FASchemaResult.error) });
    return;
  }

  req.validatedData = disable2FASchemaResult.data;
  next();
}