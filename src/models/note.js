import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      enum: TAGS, // Тепер беремо список із файлу constants
      default: 'Todo',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Додаємо індекс для текстового пошуку по заголовку та вмісту
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;