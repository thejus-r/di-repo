import express from "express";
import container from "./container";
import { BookController } from "./controller/book.controller";

const port = 3000;
const app = express();

const bookController: BookController = container.get(BookController);
app.use("/books", bookController.routes());

app.listen(port, () => console.log(`listening on port: ${port}`));
