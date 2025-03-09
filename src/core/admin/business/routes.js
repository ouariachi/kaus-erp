import { Router } from 'express';
import { create } from './controllers/create.js';
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from './middlewares/create.js';
import { list } from './controllers/list.js';
import { getById } from './controllers/getById.js';
import { listUsers } from './controllers/listUsers.js';

const adminBusinessRouter = Router(); 
adminBusinessRouter.get('/', list);
adminBusinessRouter.post(
  "/", 
  createAccessMiddleware,
  createValidationDataMiddleware,    
  createUniqueMiddleware,
  create
);
adminBusinessRouter.get('/:id', getById);
adminBusinessRouter.get("/:id/users", listUsers);


export default adminBusinessRouter;