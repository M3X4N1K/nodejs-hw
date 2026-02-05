import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

const router = Router();

// Застосовуємо аутентифікацію для всіх маршрутів користувача
router.use(authenticate);

// PATCH /users/me/avatar
// 'avatar' - це ім'я поля у формі (form-data), де лежить файл
router.patch('/users/me/avatar', upload.single('avatar'), updateUserAvatar);

export default router;