import { describe, test, expect, vi, beforeEach } from "vitest";
import { BookService } from "../../service/book.service";
import { IBookRepository } from "../../repository/book.repository";
import { Book, BookInsertPayload, bookSchema } from "../../model/book.model";

const mockBooks: Book[] = [
  {
    id: 1,
    name: "some name",
    author: "some author",
  },
];

class Repository implements IBookRepository {
  books: Book[] = mockBooks;

  // functions
  getBooks = () => {
    return this.books;
  };

  insertBook = (data: BookInsertPayload): Book | undefined => {
    const newBook = {
      id: this.books.length + 1,
      ...data,
    } as Book;

    this.books.push(newBook);
    return newBook;
  };

  findBookById = (id: number): Book | undefined => {
    return this.books[id];
  };
  deleteBookById = (id: number): boolean => {
    return false;
  };

  updateBookById = (id: number, data: BookInsertPayload): Book | undefined => {
    const book = this.books[id];
    this.books[id] = {
      id: book.id,
      ...data,
    };
    return this.books[id];
  };
}

describe("book service", () => {
  test("returns all books", () => {
    const bookService = new BookService(new Repository());
    expect(bookService.getAllBooks()).toBe(mockBooks);
  });

  test("returns book of the id", () => {
    const bookService = new BookService(new Repository());
    expect(bookService.getBookById(0)).toBe(mockBooks[0]);
  });

  test("delete book by id", () => {
    const bookService = new BookService(new Repository());
    expect(bookService.deleteBookById(1)).toBe(false);
  });

  test("create book", () => {
    const bookService = new BookService(new Repository());
    bookService.createBook({
      name: "another book",
      author: "another author",
    }),
      expect(bookService.getAllBooks().length).toBe(2);
  });

  test("update book", () => {
    const bookService = new BookService(new Repository());
    bookService.updateBookById(0, {
      name: "another book",
      author: "another author",
    }),
      expect(bookService.getAllBooks()[0]).toStrictEqual({
        id: 1,
        name: "another book",
        author: "another author",
      });
  });
});
