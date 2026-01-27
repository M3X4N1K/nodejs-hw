import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// 1. Спочатку логування (щоб фіксувати всі запити)
app.use(logger);

// 2. Стандартні middleware
app.use(cors());
app.use(express.json());

// 3. Підключення роутів
// Ми не вказуємо тут '/notes', бо це прописано всередині notesRouter
app.use(notesRouter);

// 4. Обробка неіснуючих маршрутів (404)
app.use(notFoundHandler);

// 5. Глобальна обробка помилок (500)
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongoDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();