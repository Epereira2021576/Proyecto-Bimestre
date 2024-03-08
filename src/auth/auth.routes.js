import { Router } from 'express';
import { check } from 'express-validator';
import { register, login } from '../auth/auth.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { existingEmail } from '../helpers/db-validators.js';

const router = Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be more than 6 characters').isLength({
      min: 6,
    }),
    check('email', 'Email is not valid').isEmail(),
    check('email').custom(existingEmail),
    validateFields,
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Email is not valid').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,
  ],
  login
);

export default router;
