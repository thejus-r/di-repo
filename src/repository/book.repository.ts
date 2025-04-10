import { inject, injectable } from "inversify";
import {
  Book,
  BookInsertPayload,
  BookUpdatePayload,
} from "../model/book.model";
import { IDatabaseConnector, SQLiteConnector } from "../database/sqlite";
import { DatabaseSync } from "node:sqlite";

export interface IBookRepository {
  getBooks: () => Book[];
  insertBook: (data: BookInsertPayload) => Book | undefined;
  findBookById: (id: number) => Book | undefined;
  deleteBookById: (id: number) => boolean;
  updateBookById: (id: number, data: BookInsertPayload) => Book | undefined;
}

@injectable()
export class BookRepository implements IBookRepository {
  private dbConn: DatabaseSync;
  constructor(
    @inject(SQLiteConnector)
    private readonly _database: IDatabaseConnector,
  ) {
    this.dbConn = _database.getDBConn();

    // Initialize table if it doesn't exists
    this.dbConn.exec(
      `CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY,
        name TEXT,
        author TEXT
        ) STRICT
        `,
    );
  }

  getBooks = () => {
    const query = this.dbConn.prepare(`SELECT * FROM books ORDER BY id`);
    return query.all() as Book[];
  };

  insertBook = (data: BookInsertPayload): Book | undefined => {
    try {
      const { name, author } = data;
      const insert = this.dbConn.prepare(
        `INSERT INTO books (name, author) VALUES (?, ?) RETURNING *`,
      );
      const newBook = insert.get(name, author);
      return (newBook as Book) ?? undefined;
    } catch (error) {
      throw new Error(`unable to access database: ${error}`);
    }
  };

  findBookById = (id: number): Book | undefined => {
    try {
      const find = this.dbConn.prepare(`SELECT * FROM books WHERE id = ?`);
      const book = find.get(id);
      return book as Book | undefined;
    } catch (error) {}
  };

  deleteBookById = (id: number): boolean => {
    try {
      const query = this.dbConn.prepare(`DELETE FROM books WHERE id = ?`);
      const result = query.run(id);
      if (result.changes) {
        return true;
      }
    } catch (error) {
      throw new Error(`unable to access database: ${error}`);
    }
    return false;
  };

  updateBookById = (id: number, data: BookInsertPayload): Book | undefined => {
    try {
      const { name, author } = data;
      const query = this.dbConn.prepare(
        `UPDATE books SET name = ?, author = ? WHERE id = ? RETURNING *`,
      );
      const updatedBook = query.get(name, author, id);
      return updatedBook as Book | undefined;
    } catch (error) {
      throw new Error(`unable to access database: ${error}`);
    }
  };
}
