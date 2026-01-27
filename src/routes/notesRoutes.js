import { Router } from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from '../controllers/notesController.js';

const router = Router();

// GET /notes - отримати всі
router.get('/notes', getAllNotes);

// GET /notes/:noteId - отримати одну
router.get('/notes/:noteId', getNoteById);

// POST /notes - створити
router.post('/notes', createNote);

// DELETE /notes/:noteId - видалити
router.delete('/notes/:noteId', deleteNote);

// PATCH /notes/:noteId - оновити
router.patch('/notes/:noteId', updateNote);

export default router;