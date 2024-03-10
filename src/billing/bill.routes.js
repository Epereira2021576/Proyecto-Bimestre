import { Router } from 'express';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { buyBill, updateBilling, userBillings } from './bill.controller.js';
import {
  validationOfRoleClient,
  validationOfRole,
} from '../middlewares/role-validator.js';

const router = Router();

router.post('/buyBill', [validateJWT, validationOfRoleClient], buyBill);

router.put('/billChange/:id', [validateJWT, validationOfRole], updateBilling);

router.get('/checks/:userId', [validateJWT, validationOfRole], userBillings);
router.get(
  '/userchecks/:userId',
  [validateJWT, validationOfRole],
  userBillings
);

export default router;
