import { inject, injectable } from "inversify";
import { Book } from "../model/book.model";
import { IDatabaseConnector, SQLiteConnector } from "../database/sqlite";
import { DatabaseSync } from "node:sqlite";

export interface IBookRepository {
  getBooks: () => Book[];
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
}
