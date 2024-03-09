import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import {
  productoPost,
  getProductos,
  productoPut,
  productoDelete,
  buscarProductoPorCategoria,
} from './products.controller.js';

import { validationOfRole } from '../middlewares/role-validator.js';
const router = Router();

router.get('/', getProductos);

router.post(
  '/',
  [
    check('name', 'Name required').not().isEmpty(),
    check('price', 'Price required').not().isEmpty(),
    check('category', 'Category Required').not().isEmpty(),
    check('stock', 'Stock required').not().isEmpty(),
    validateFields,
    validationOfRole,
  ],
  productoPost
);

router.put(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validateFields,
    validationOfRole,
  ],
  productoPut
);

router.delete(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validateFields,
    validationOfRole,
  ],
  productoDelete
);

router.get('/:idCategoria', buscarProductoPorCategoria);

export default router;
