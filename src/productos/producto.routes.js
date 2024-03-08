import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import {
  productoPost,
  getProductos,
  productoPut,
  productoDelete,
  buscarProductoPorCategoria,
} from './producto.controller.js';

import { validationOfRole } from '../middlewares/role-validator.js';
const router = Router();

router.get('/', getProductos);

router.post(
  '/',
  [
    check('name', 'Se requiere un nombre').not().isEmpty(),
    check('price', 'Se requiere un precio').not().isEmpty(),
    check('category', 'Se requiere una categoria').not().isEmpty(),
    check('stock', 'Se requiere un stock').not().isEmpty(),
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

router.get('/:category', buscarProductoPorCategoria);

export default router;
