import multer from 'multer';
import createHttpError from 'http-errors';

// Зберігаємо файл у пам'яті (RAM), а не на диску,
// бо ми одразу відправимо його в Cloudinary
const storage = multer.memoryStorage();

const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB
};

const fileFilter = (req, file, callback) => {
  // Перевірка типу файлу (має бути картинка)
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(createHttpError(400, 'Only images allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});