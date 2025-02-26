import { Router } from "express";
import { adminAccessMiddleware } from "./middlewares/access.js";
import adminBusinessRouter from "./business/routes.js";

const adminRouter = Router();
adminRouter.use(adminAccessMiddleware)
adminRouter.use("/business", adminBusinessRouter);

export default adminRouter;