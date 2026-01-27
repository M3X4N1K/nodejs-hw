import Joi from 'joi';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна перевірка ID (чи схоже це на ID з MongoDB)
const objectIdValidation = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('"noteId" should be a valid mongo id');
  }
  return value;
};

// Правила для створення нотатки (POST)
export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow(''), // Може бути пустим
  tag: Joi.string()
    .valid(...TAGS)
    .optional(),
});

// Правила для оновлення нотатки (PATCH)
export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1),
  content: Joi.string().allow(''),
  tag: Joi.string().valid(...TAGS),
})
  .min(1) // Хоча б одне поле має бути вказане
  .messages({
    'object.min': 'Missing fields in request body',
  });

// Правила для отримання списку (GET /notes)
export const getAllNotesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(5).max(20).default(10),
  tag: Joi.string().valid(...TAGS),
  search: Joi.string().allow(''),
});

// Правила для перевірки ID в адресі (GET/DELETE/PATCH /notes/:noteId)
export const noteIdSchema = Joi.object({
  noteId: Joi.string().custom(objectIdValidation).required(),
});