import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js'; // 1. Імпорт

const router = Router();

// 2. Вмикаємо захист для всіх маршрутів нижче
router.use(authenticate);

router.get(
  '/notes',
  celebrate({
    query: getAllNotesSchema,
  }),
  getAllNotes
);

router.get(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
  }),
  getNoteById
);

router.post(
  '/notes',
  celebrate({
    body: createNoteSchema,
  }),
  createNote
);

router.delete(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
  }),
  deleteNote
);

router.patch(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
    body: updateNoteSchema,
  }),
  updateNote
);

export default router;