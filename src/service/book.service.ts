import { inject, injectable } from "inversify";
import { BookRepository } from "../repository/book.repository";
import {
  Book,
  BookInsertPayload,
  BookUpdatePayload,
} from "../model/book.model";

export interface IBookService {
  getAllBooks: () => Book[];
  createBook: (data: BookInsertPayload) => Book | undefined;
  getBookById: (id: number) => Book | undefined;
  deleteBookById: (id: number) => boolean;
  updateBookById: (
    id: number,
    book: Book,
    data: BookUpdatePayload,
  ) => Book | undefined;
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

  createBook = (data: BookInsertPayload): Book | undefined => {
    return this._bookRepository.insertBook(data);
  };

  getBookById = (id: number): Book | undefined => {
    return this._bookRepository.findBookById(id);
  };

  deleteBookById = (id: number): boolean => {
    return this._bookRepository.deleteBookById(id);
  };

  updateBookById = (id: number, data: BookInsertPayload): Book | undefined => {
    return this._bookRepository.updateBookById(id, data);
  };
}
