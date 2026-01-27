import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const router = Router();

// Реєстрація
router.post(
  '/register',
  celebrate({
    body: registerUserSchema,
  }),
  registerUser
);

// Логін
router.post(
  '/login',
  celebrate({
    body: loginUserSchema,
  }),
  loginUser
);

// Refresh
router.post('/refresh', refreshUserSession);

// Logout
router.post('/logout', logoutUser);

export default router;