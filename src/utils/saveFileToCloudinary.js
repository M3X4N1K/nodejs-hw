import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // Стандартний модуль Node.js

// Налаштування (беруться з .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Створюємо потік завантаження
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'avatars' }, // Можна вказати папку в Cloudinary
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Перетворюємо буфер на потік і відправляємо
    Readable.from(fileBuffer).pipe(uploadStream);
  });
};