import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRole } from '../middlewares/validate-roles.js';
import { existingEmail, existingUserById } from '../helpers/db-validators.js';
import {
  adminUsersPut,
  clientUsersPut,
  deleteUser,
} from './user.controller.js';

const router = Router();

router.put(
  '/:id',
  [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(existingUserById),
    validateFields,
  ],
  adminUsersPut
);

router.put(
  '/put/:id',
  [
    validateJWT,
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(existingUserById),
    validateFields,
  ],
  clientUsersPut
);

router.delete(
  '/:id',
  [
    validateJWT,
    hasRole('ADMIN_ROLE', 'CLIENT_ROLE'),
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(existingUserById),
    validateFields,
  ],
  deleteUser
);

export default router;
