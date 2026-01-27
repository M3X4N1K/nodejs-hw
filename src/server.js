import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

// 1. Ініціалізація змінних оточення
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Стандартні Middleware
app.use(cors()); // Дозволяє запити з інших доменів
app.use(express.json()); // Дозволяє парсити JSON у body запиту

// 3. Налаштування логера pino-http
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  })
);

// 4. Маршрути (Routes)

// Маршрут для отримання всіх нотаток
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Маршрут для отримання нотатки за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Спеціальний тестовий маршрут для імітації помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 5. Middleware для обробки неіснуючих маршрутів (404)
// Має бути ПІСЛЯ всіх ваших маршрутів
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// 6. Middleware для обробки помилок (500)
// Має бути останнім у списку app.use
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

// 7. Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});