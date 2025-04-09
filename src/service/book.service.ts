import { inject, injectable } from "inversify";
import { BookRepository } from "../repository/book.repository";
import { Book } from "../model/book.model";

export interface IBookService {
  getAllBooks: () => Book[];
}

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject(BookRepository)
    private readonly _bookRepository: BookRepository,
  ) {}

  getAllBooks = (): Book[] => {
    return this._bookRepository.getBooks();
  };
}
