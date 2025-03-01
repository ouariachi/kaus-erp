import { Router } from 'express';
import { create } from './controllers/create.js';
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from './middlewares/create.js';
import { list } from './controllers/list.js';
import { getById } from './controllers/getById.js';

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



export default adminBusinessRouter;