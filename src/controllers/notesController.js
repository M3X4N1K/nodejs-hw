import createHttpError from 'http-errors';
import Note from '../models/note.js';

// Отримати всі нотатки з пагінацією, фільтрацією та пошуком
export const getAllNotes = async (req, res, next) => {
  try {
    // Отримуємо параметри. Завдяки валідації (яку підключимо далі),
    // page та perPage вже будуть числами та матимуть дефолтні значення.
    const { page = 1, perPage = 10, tag, search } = req.query;

    // Формуємо фільтр пошуку
    const filter = {};
    
    // Якщо передано тег — додаємо до фільтру
    if (tag) {
      filter.tag = tag;
    }

    // Якщо передано текст пошуку — використовуємо $text оператор MongoDB
    if (search) {
      filter.$text = { $search: search };
    }

    // Рахуємо, скільки записів пропустити
    const skip = (page - 1) * perPage;

    // Виконуємо два запити паралельно:
    // 1. Отримуємо самі нотатки (з лімітом і пропуском)
    // 2. Рахуємо загальну кількість нотаток, що підходять під фільтр
    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(perPage),
      Note.countDocuments(filter),
    ]);

    // Рахуємо кількість сторінок
    const totalPages = Math.ceil(totalNotes / perPage);

    // Відправляємо розширену відповідь
    res.status(200).json({
      status: 200,
      message: 'Successfully found notes!',
      data: {
        notes,
        page,
        perPage,
        totalNotes,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found note with id ${noteId}!`,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a note!',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully deleted a note!',
        data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const result = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
    });

    if (!result) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a note!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};