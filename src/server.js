import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(userRouter);
app.use(notesRouter);

// Виправлено порядок: спочатку 404
app.use(notFoundHandler);

// Потім обробка помилок валідації Celebrate
app.use(errors());

// В кінці загальний обробник помилок
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