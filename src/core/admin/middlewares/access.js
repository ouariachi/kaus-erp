import { isAdmin } from '#src/utils/auth/userRole';

/** @type {import('express').RequestHandler} */
export const adminAccessMiddleware = (req, res, next) => {
  if (!isAdmin(req.session.user)) {
    return res.status(404).json({ message: 'Resource not found' });
  }
  next();
};
