import { Book } from "../model/book.model";

export interface IBookRepository {
  getBooks: () => Book[];
}

export class BookRepository implements IBookRepository {
  private _books: Book[] = [
    {
      id: 1,
      name: "Building a Second Brain",
      author: "Tiago Forte",
    },
    {
      id: 2,
      name: "Ikigai",
      author: "Hector Gargia",
    },
  ];

  getBooks = () => {
    return this._books;
  };
}
