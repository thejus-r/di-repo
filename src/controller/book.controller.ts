import type { Request, Response, NextFunction, Router } from "express";
import express from "express";
import { inject, injectable } from "inversify";
import { BookService } from "../service/book.service";
import { Book, bookInsertSchema, bookUpdateSchema } from "../model/book.model";
import { Type, type } from "arktype";

export interface IBookController {
  routes: () => Router;
}

@injectable()
export class BookController implements IBookController {
  private _router: Router;

  constructor(
    @inject(BookService)
    private readonly _bookService: BookService,
  ) {
    this._router = express.Router();
  }

  private _getBook = (req: Request, res: Response, next: NextFunction) => {
    let book: Book | undefined;
    try {
      const { id } = req.params;
      const idAsInt = parseInt(id, 10);

      if (isNaN(idAsInt)) {
        res.status(401).json({ error: "invaid param" });
        return;
      }
      book = this._bookService.getBookById(idAsInt);
      if (!book) {
        res.status(404).json({ message: "book not found" });
        return;
      }

      res.locals.book = book;
      next();
    } catch (error) {
      next(error);
    }
  };

  private _getAllBooks = (req: Request, res: Response, next: NextFunction) => {
    res.json({ books: this._bookService.getAllBooks() });
  };

  private _createBook = (req: Request, res: Response, next: NextFunction) => {
    const data = bookInsertSchema(req.body);

    if (data instanceof type.errors) {
      res.status(400).json({ error: "BAD_REQUEST", summary: data.summary });
      return;
    }

    try {
      const newBook = this._bookService.createBook(data);
      if (!newBook) {
        res.status(401).json({ error: "error while creating a book" });
        return;
      }
      res.json({ data: newBook });
    } catch (error) {
      next(error);
    }
  };

  private _getBookById = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ data: res.locals.book });
      return;
    } catch (error) {
      next(error);
    }
  };

  private _updateBookById = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const book = res.locals.book as Book;
    const updateData = bookUpdateSchema(req.body);
    if (updateData instanceof type.errors) {
      res
        .status(400)
        .json({ error: "BAD_REQUEST", summary: updateData.summary });
      return;
    }

    if (updateData.name) {
      book.name = updateData.name;
    }
    if (updateData.author) {
      book.author = updateData.author;
    }
    try {
      const updatedBook = this._bookService.updateBookById(book.id, book);
      res.status(200).json({ data: updatedBook });
      return;
    } catch (error) {
      next(error);
    }
  };

  private _deleteBookById = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const book = res.locals.book as Book;
    try {
      const result = this._bookService.deleteBookById(book.id);
      console.log(result);
      if (result) {
        res.status(201).json({ message: "deleted" });
        return;
      }
      return;
    } catch (error) {
      next(error);
    }
  };
  routes = () => {
    this._router.get("/", this._getAllBooks);
    this._router.post("/", this._createBook);
    this._router.get("/:id", this._getBook, this._getBookById);
    this._router.post("/:id", this._getBook, this._updateBookById);
    this._router.delete("/:id", this._getBook, this._deleteBookById);
    return this._router;
  };
}
