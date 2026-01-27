import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

app.use(notFoundHandler);
app.use(errorHandler);

// Використовуємо Top-level await замість обгортки startServer
try {
  await connectMongoDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}