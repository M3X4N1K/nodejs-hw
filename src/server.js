import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate'; // 1. Імпорт обробника помилок валідації

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use(notesRouter);

// 2. Підключаємо обробник помилок валідації
// Важливо: він має бути ПІСЛЯ роутів, але ПЕРЕД іншими обробниками помилок
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