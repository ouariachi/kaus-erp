import { Router } from "express";
import { loginController } from "./controllers/loginController.js";
import { loginMiddleware } from "./middlewares/loginMiddleware.js";
import { logoutController } from "./controllers/logoutController.js";
import { registerController } from "./controllers/registerController.js";
import { validateRegistrationDataMiddleware, validateAllowedEmailMiddleware } from "./middlewares/registerMiddlewares.js";
import { emailVerificationController, resendEmailVerificationController } from "./controllers/emailVerificationControllers.js";
import { confirm2FAController, disable2FAController, enable2FAController } from "./controllers/2FAControllers.js";
import { confirm2FAMiddleware, disable2FAMiddleware, enable2FAMiddleware } from "./middlewares/2FAMiddlewares.js";
import { authenticateMiddleware } from "./middlewares/authenticateMiddleware.js";

const authRouter = Router();
authRouter.post("/login", loginMiddleware, loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/register", validateRegistrationDataMiddleware, validateAllowedEmailMiddleware, registerController);
authRouter.get("/email-verification", emailVerificationController);
authRouter.get("/email-verification/resend", resendEmailVerificationController);
authRouter.post("/2FA/enable", authenticateMiddleware, enable2FAMiddleware, enable2FAController);
authRouter.post("/2FA/confirm", authenticateMiddleware, confirm2FAMiddleware, confirm2FAController);
authRouter.post("/2FA/disable", authenticateMiddleware, disable2FAMiddleware, disable2FAController);

export default authRouter;
