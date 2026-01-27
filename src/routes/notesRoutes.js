import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const router = express.Router();

// GET /notes - отримати всі нотатки
router.get('/notes', getAllNotes);

// GET /notes/:noteId - отримати одну нотатку за ID
router.get('/notes/:noteId', getNoteById);

// POST /notes - створити нову нотатку
router.post('/notes', createNote);

// DELETE /notes/:noteId - видалити нотатку
router.delete('/notes/:noteId', deleteNote);

// PATCH /notes/:noteId - оновити нотатку
router.patch('/notes/:noteId', updateNote);

export default router;