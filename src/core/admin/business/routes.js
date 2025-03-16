import { Router } from "express";
import { createBusinessController } from "./controllers/createBusinessController.js";
import { createBusinessAccessMiddleware, createBusinessUniqueMiddleware, createBusinessValidationDataMiddleware } from "./middlewares/createBusinessMiddlewares.js";
import { listBusinessesController } from "./controllers/listBusinessesController.js";
import { getBusinessController } from "./controllers/getBusinessController.js";
import { listUsersController } from "./controllers/listUsersController.js";
import { addUserController } from "./controllers/addUserController.js";
import { addUserBusinessExistsMiddleware, addUserUserExistsMiddleware, addUserValidationDataMiddleware } from "./middlewares/addUserMiddlewares.js";
import { getBusinessUserController } from "./controllers/getBusinessUserController.js";
import { updateBusinessAccessMiddleware, updateBusinessExistsMiddleware, updateBusinessUniqueMiddleware, updateBusinessValidationDataMiddleware } from "./middlewares/updateBusinessMiddlewares.js";
import { updateBusinessController } from "./controllers/updateBusinessController.js";
import { updateBusinessStatusAccessMiddleware, updateBusinessStatusExistsMiddleware, updateBusinessStatusValidationDataMiddleware } from "./middlewares/updateBusinessStatusMiddlewares.js";
import { updateBusinessStatusController } from "./controllers/updateBusinessStatusController.js";
import { deleteBusinessController } from "./controllers/deleteBusinessController.js";
import { deleteBusinessAccessMiddleware, deleteBusinessExistsMiddleware } from "./middlewares/deleteBusinessMiddlewares.js";

const adminBusinessRouter = Router();

// List all businesses
adminBusinessRouter.get("/", listBusinessesController);

// Create a new business
adminBusinessRouter.post("/", 
  createBusinessAccessMiddleware, 
  createBusinessValidationDataMiddleware, 
  createBusinessUniqueMiddleware, 
  createBusinessController
);

// Get a business by id
adminBusinessRouter.get("/:id", getBusinessController);

// Update a business
adminBusinessRouter.patch("/:id", 
  updateBusinessAccessMiddleware, 
  updateBusinessValidationDataMiddleware, 
  updateBusinessExistsMiddleware, 
  updateBusinessUniqueMiddleware, 
  updateBusinessController
);

// Update status of a business
adminBusinessRouter.patch("/:id/status",
  updateBusinessStatusAccessMiddleware,
  updateBusinessStatusValidationDataMiddleware,
  updateBusinessStatusExistsMiddleware,
  updateBusinessStatusController
);

// Delete a business
adminBusinessRouter.delete("/:id", 
  deleteBusinessAccessMiddleware, 
  deleteBusinessExistsMiddleware, 
  deleteBusinessController
);

// List users of a business
adminBusinessRouter.get("/:id/users", listUsersController);

// Add a user to a business
adminBusinessRouter.post("/:id/users", 
  addUserValidationDataMiddleware, 
  addUserBusinessExistsMiddleware, 
  addUserUserExistsMiddleware, 
  addUserController
);

// Get a user by id
adminBusinessRouter.get("/:id/users/:userId", getBusinessUserController);

// Update a user
// TODO: Implement update user

// Delete a user
// TODO: Implement delete user

export default adminBusinessRouter;
