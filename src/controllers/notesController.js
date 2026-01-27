import createHttpError from 'http-errors';
import Note from '../models/note.js';

// Отримати всі нотатки
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    
    res.status(200).json({
      status: 200,
      message: 'Successfully found notes!',
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// Отримати одну нотатку за ID
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  
  try {
    const note = await Note.findById(noteId);

    // Якщо нотатки немає в базі - кидаємо помилку 404
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

// Створити нову нотатку
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

// Видалити нотатку
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

// Оновити нотатку
export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    // { new: true } повертає вже оновлену версію документа
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