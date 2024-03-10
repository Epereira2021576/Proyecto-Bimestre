import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import {
  productoPost,
  getProductos,
  productoPut,
  productoDelete,
  categoryProducts,
  searchProducts,
  productInventory,
  soldOutProducts,
} from './products.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
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

router.get('/:nameCat', categoryProducts);

router.get('/product/:prodName', searchProducts);
router.get(
  '/control/inventory',
  [validateJWT, validationOfRole],
  productInventory
);

router.get(
  '/control/soldOut',
  [validateJWT, validationOfRole],
  soldOutProducts
);

export default router;
