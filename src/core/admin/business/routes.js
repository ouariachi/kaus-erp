import { Router } from 'express';
import { create } from './controllers/create.js';
import { createAccessMiddleware, createUniqueMiddleware, createValidationDataMiddleware } from './middlewares/create.js';
import { list } from './controllers/list.js';

const adminBusinessRouter = Router(); 
adminBusinessRouter.post(
  "/create", 
  createAccessMiddleware,
  createValidationDataMiddleware,    
  createUniqueMiddleware,
  create
);
adminBusinessRouter.get('/list/:page?', list);
adminBusinessRouter.get('/', (_, res) => res.json({ message: 'Admin Business route' }));

export default adminBusinessRouter;