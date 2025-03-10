import { isAdmin } from "#src/utils/auth/userRole";
import { HTTP_MESSAGES } from "#src/utils/httpMessages";

/** @type {import('express').RequestHandler} */
export const adminAccessMiddleware = (req, res, next) => {
  if (!isAdmin(req.session.user)) {
    return res.status(404).json({ message: HTTP_MESSAGES[404] });
  }
  next();
};
