import { Router } from 'express';
import { create } from './controllers/create.js';
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from './middlewares/create.js';
import { list } from './controllers/list.js';
import { getById } from './controllers/getById.js';
import { listUsers } from './controllers/listUsers.js';

const adminBusinessRouter = Router(); 
adminBusinessRouter.get('/', (_, res) => res.json({ message: 'Admin Business route' }));
adminBusinessRouter.post(
  "/create", 
  createAccessMiddleware,
  createValidationDataMiddleware,    
  createUniqueMiddleware,
  create
);
adminBusinessRouter.get('/list/:page?', list);
adminBusinessRouter.get('/:id', getById);
adminBusinessRouter.get("/:id/users/:page?", listUsers);


export default adminBusinessRouter;