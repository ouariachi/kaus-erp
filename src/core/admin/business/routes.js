import { Router } from "express";
import { createBusinessController } from "./controllers/createBusinessController.js";
import { createBusinessAccessMiddleware, createBusinessUniqueMiddleware, createBusinessValidationDataMiddleware } from "./middlewares/createBusinessMiddlewares.js";
import { listBusinessesController } from "./controllers/listBusinessesController.js";
import { getBusinessController } from "./controllers/getBusinessController.js";
import { listUsersController } from "./controllers/listUsersController.js";
import { addBusinessUserController } from "./controllers/addBusinessUserController.js";
import { addBusinessUserBusinessExistsMiddleware, addBusinessUserUserExistsMiddleware, addBusinessUserValidationDataMiddleware } from "./middlewares/addBusinessUserMiddlewares.js";
import { getBusinessUserController } from "./controllers/getBusinessUserController.js";
import { updateBusinessAccessMiddleware, updateBusinessExistsMiddleware, updateBusinessUniqueMiddleware, updateBusinessValidationDataMiddleware } from "./middlewares/updateBusinessMiddlewares.js";
import { updateBusinessController } from "./controllers/updateBusinessController.js";
import { updateBusinessStatusAccessMiddleware, updateBusinessStatusExistsMiddleware, updateBusinessStatusValidationDataMiddleware } from "./middlewares/updateBusinessStatusMiddlewares.js";
import { updateBusinessStatusController } from "./controllers/updateBusinessStatusController.js";
import { deleteBusinessController } from "./controllers/deleteBusinessController.js";
import { deleteBusinessAccessMiddleware, deleteBusinessExistsMiddleware } from "./middlewares/deleteBusinessMiddlewares.js";
import { updateBusinessUserExistsMiddleware, updateBusinessUserValidationDataMiddleware } from "./middlewares/updateBusinessUserMiddlewares.js";
import { updateBusinessUserController } from "./controllers/updateBusinessUserController.js";
import { deleteBusinessUserExistsMiddleware } from "./middlewares/deleteBusinessUserMiddlewares.js";
import { deleteBusinessUserController } from "./controllers/deleteBusinessUserController.js";

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
  addBusinessUserValidationDataMiddleware, 
  addBusinessUserBusinessExistsMiddleware, 
  addBusinessUserUserExistsMiddleware, 
  addBusinessUserController
);

// Get a user by id
adminBusinessRouter.get("/:id/users/:userId", getBusinessUserController);

// Update a user
adminBusinessRouter.patch("/:id/users/:userId",
  updateBusinessUserValidationDataMiddleware,
  updateBusinessUserExistsMiddleware,
  updateBusinessUserController
);

// Delete a user
adminBusinessRouter.delete("/:id/users/:userId", 
  deleteBusinessUserExistsMiddleware, 
  deleteBusinessUserController
);

export default adminBusinessRouter;
