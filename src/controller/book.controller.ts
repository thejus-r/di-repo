import type { Request, Response, NextFunction, Router } from "express";
import express from "express";
import { inject, injectable } from "inversify";
import { BookService } from "../service/book.service";

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

  private _getAllBooks = (req: Request, res: Response, next: NextFunction) => {
    res.json({ books: this._bookService.getAllBooks() });
  };

  routes = () => {
    this._router.get("/", this._getAllBooks);
    return this._router;
  };
}
