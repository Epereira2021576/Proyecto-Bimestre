import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validationOfRoleClient } from '../middlewares/role-validator.js';

import { cartDataSave, cartDataDelete } from './cart.controller.js';
const router = Router();
router.post(
  '/',
  [
    check('cDate', 'Date required').not().isEmpty(),
    check('user', 'User required').not().isEmpty(),
    check('product', 'Product Required').not().isEmpty(),
    check('quantity', 'Quantity required').not().isEmpty(),
    validateJWT,
    validationOfRoleClient,
  ],
  cartDataSave
);
router.delete(
  '/delete/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validateJWT,
    validationOfRoleClient,
  ],
  cartDataDelete
);

export default router;
