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

const router = Router();

// GET /notes - валідуємо query параметри (page, perPage, tag, search)
router.get(
  '/notes',
  celebrate({
    query: getAllNotesSchema,
  }),
  getAllNotes
);

// GET /notes/:noteId - валідуємо параметр ID
router.get(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
  }),
  getNoteById
);

// POST /notes - валідуємо тіло запиту
router.post(
  '/notes',
  celebrate({
    body: createNoteSchema,
  }),
  createNote
);

// DELETE /notes/:noteId - валідуємо параметр ID
router.delete(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
  }),
  deleteNote
);

// PATCH /notes/:noteId - валідуємо ID та тіло запиту
router.patch(
  '/notes/:noteId',
  celebrate({
    params: noteIdSchema,
    body: updateNoteSchema,
  }),
  updateNote
);

export default router;