import createHttpError from 'http-errors';
import User from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    // 1. Перевірка наявності файлу
    if (!req.file) {
      throw createHttpError(400, 'No file uploaded');
    }

    // 2. Завантаження в Cloudinary
    const result = await saveFileToCloudinary(req.file.buffer);

    // 3. Оновлення посилання в базі даних
    // req.user._id ми маємо завдяки middleware 'authenticate'
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // 4. Відповідь
    res.status(200).json({
      status: 200,
      message: 'Avatar updated successfully',
      data: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    next(error);
  }
};