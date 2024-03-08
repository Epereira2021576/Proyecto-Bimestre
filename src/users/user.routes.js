import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields';
import { emailExists, userExistsById } from '../helpers/db-validators';
import { userPost, userGet } from './user.controller.js';

const router = Router();

router.post(
  '/',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('email').custom(emailExists),
    check(
      'password',
      'The password must be greater than 6 characters'
    ).isLength({
      min: 6,
    }),
    validateFields,
  ],
  userPost
);

router.get('/', userGet);
