import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validate-fields.js';
import {
  categoryDelete,
  categoryPost,
  categoryPut,
  getCategories,
} from './category.controller.js';

import { validationOfRole } from '../middlewares/role-validator.js';

const router = Router();

router.get('/', getCategories);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'A description must be included').not().isEmpty(),
    validateFields,
    validationOfRole,
  ],
  categoryPost
);

router.put(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validateFields,
    validationOfRole,
  ],
  categoryPut
);

router.delete(
  '/:id',
  [
    check('id', 'The id is not a valid MongoDB format').isMongoId(),
    validateFields,
    validationOfRole,
  ],
  categoryDelete
);

export default router;
