import { Router } from "express";
import { login } from "./controllers/login.js";
import { loginMiddleware } from "./middlewares/login.js";
import { logout } from "./controllers/logout.js";
import { register } from "./controllers/register.js";
import { validateRegistrationDataMiddleware, validateAllowedEmailMiddleware } from "./middlewares/register.js";
import { emailVerification, resendEmailVerification } from "./controllers/emailVerification.js";
import { confirm2FA, disable2FA, enable2FA } from "./controllers/2FA.js";
import { confirm2FAMiddleware, disable2FAMiddleware, enable2FAMiddleware } from "./middlewares/2FA.js";
import { authenticate } from "./middlewares/session.js";

const authRouter = Router();
authRouter.post("/login", loginMiddleware, login);
authRouter.post("/logout", logout);
authRouter.post("/register", validateRegistrationDataMiddleware, validateAllowedEmailMiddleware, register);
authRouter.get("/email-verification", emailVerification);
authRouter.get("/email-verification/resend", resendEmailVerification);
authRouter.post("/2FA/enable", authenticate, enable2FAMiddleware, enable2FA);
authRouter.post("/2FA/confirm", authenticate, confirm2FAMiddleware, confirm2FA);
authRouter.post("/2FA/disable", authenticate, disable2FAMiddleware, disable2FA);

export default authRouter;