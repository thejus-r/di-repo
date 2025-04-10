import { type } from "arktype";

/**
 * Base schema for book, this version is not exported or not need anyway else,
 * this is just a building block for the variations of the Book Schema
 */
const book = type({
  id: "number",
  "name?": "string < 16",
  "author?": "string < 16",
});

/**
 * Schema for Books
 */
export const bookSchema = book.required();

/**
 * Schema for parsing or validation of update payloads
 * @name optional
 * @author optional
 */
export const bookUpdateSchema = book.omit("id");

/**
 * Schema for parsing or validation of insert payloads
 * @name required
 * @author required
 */
export const bookInsertSchema = bookUpdateSchema.required();

// Types
export type Book = typeof bookSchema.infer;
export type BookUpdatePayload = typeof bookUpdateSchema.infer;
export type BookInsertPayload = typeof bookInsertSchema.infer;
