import { Router } from "express";
import { createBusinessController } from "./controllers/createBusinessController.js";
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from "./middlewares/createMiddlewares.js";
import { listBusinessesController } from "./controllers/listBusinessesController.js";
import { getBusinessController } from "./controllers/getBusinessController.js";
import { listUsersController } from "./controllers/listUsersController.js";
import { addUserController } from "./controllers/addUserController.js";
import { addUserBusinessExistsMiddleware, addUserUserExistsMiddleware, addUserValidationDataMiddleware } from "./middlewares/addUserMiddlewares.js";
import { getBusinessUserController } from "./controllers/getBusinessUserController.js";

const adminBusinessRouter = Router();

// List all businesses
adminBusinessRouter.get("/", listBusinessesController);

// Create a new business
adminBusinessRouter.post("/", createAccessMiddleware, createValidationDataMiddleware, createUniqueMiddleware, createBusinessController);

// Get a business by id
adminBusinessRouter.get("/:id", getBusinessController);

// Update a business
// TODO: Implement update business

// Delete a business
// TODO: Implement delete business

// List users of a business
adminBusinessRouter.get("/:id/users", listUsersController);

// Add a user to a business
adminBusinessRouter.post("/:id/users", addUserValidationDataMiddleware, addUserBusinessExistsMiddleware, addUserUserExistsMiddleware, addUserController);

// Get a user by id
adminBusinessRouter.get("/:id/users/:userId", getBusinessUserController);

// Update a user
// TODO: Implement update user

// Delete a user
// TODO: Implement delete user

export default adminBusinessRouter;
