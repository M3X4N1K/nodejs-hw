import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // 1. Імпорт парсера кукі
import { errors } from 'celebrate';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js'; // 2. Імпорт роутів авторизації
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // 3. Використання парсера кукі

// Маршрути
app.use('/auth', authRouter); // 4. Підключення авторизації
app.use(notesRouter);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

try {
  await connectMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}