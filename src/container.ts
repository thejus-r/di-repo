import { Container } from "inversify";
import { BookRepository } from "./repository/book.repository";
import { BookController } from "./controller/book.controller";
import { BookService } from "./service/book.service";
import { SQLiteConnector } from "./database/sqlite";

const container = new Container();

container.bind(SQLiteConnector).toSelf().inSingletonScope();
container.bind(BookRepository).toSelf();
container.bind(BookService).toSelf();
container.bind(BookController).toSelf();

export default container;
