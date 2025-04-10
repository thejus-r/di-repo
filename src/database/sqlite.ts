import { injectable } from "inversify";
import { DatabaseSync } from "node:sqlite";
import { DB_URL } from "../env";

export interface IDatabaseConnector {
  getDBConn: () => DatabaseSync;
}

@injectable()
export class SQLiteConnector implements IDatabaseConnector {
  private readonly _database: DatabaseSync;

  constructor() {
    this._database = new DatabaseSync(DB_URL);
  }

  getDBConn = (): DatabaseSync => {
    return this._database;
  };
}
