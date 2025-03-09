import { Router } from 'express';
import { create } from './controllers/create.js';
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from './middlewares/create.js';
import { list } from './controllers/list.js';
import { getById } from './controllers/getById.js';
import { listUsers } from './controllers/listUsers.js';
import { addUser } from './controllers/addUser.js';
import { addUserBusinessExistsMiddleware, addUserUserExistsMiddleware, addUserValidationDataMiddleware } from './middlewares/addUser.js';

const adminBusinessRouter = Router(); 

// List all businesses
adminBusinessRouter.get('/', list); 

// Create a new business
adminBusinessRouter.post(
  "/", 
  createAccessMiddleware,
  createValidationDataMiddleware,    
  createUniqueMiddleware,
  create
); 

// Get a business by id
adminBusinessRouter.get('/:id', getById); 

// List users of a business
adminBusinessRouter.get("/:id/users", listUsers); 

// Add a user to a business
adminBusinessRouter.post(
  "/:id/users",
  addUserValidationDataMiddleware, 
  addUserBusinessExistsMiddleware,
  addUserUserExistsMiddleware,
  addUser
); 

export default adminBusinessRouter;