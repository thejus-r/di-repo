import express from "express";
import container from "./container";
import { BookController } from "./controller/book.controller";
import { API_PORT } from "./env";

const port = API_PORT;
const app = express();

app.use(express.json());

const bookController: BookController = container.get(BookController);
app.use("/books", bookController.routes());

app.listen(port, () => console.log(`listening on port: ${port}`));
