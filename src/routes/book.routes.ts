import express from "express";

// Modelos
import { Book } from "../models/Book";
import { type Request, type Response, type NextFunction } from "express";
// Router propio de usuarios

export const bookRouter = express.Router();

// CRUD: READ
bookRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("Estamos en el middleware /author que comprueba parametros");
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page as any;
    req.query.limit = limit as any;
    next();
  } else {
    console.log("Parametros no validos:");
    console.log(JSON.stringify(req.query));
    res.status(400).json({ error: "Params page or limit are not valid" });
  }
});
bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Así leemos query params
    const page: number = req.query.page as any;
    const limit: number = req.query.limit as any;
    const books = await Book.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("author");

    // Num total de elementos
    const totalElements = await Book.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: books,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

bookRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id).populate("author");
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

bookRouter.get("/title/:title", async (req: Request, res: Response, next: NextFunction) => {
  const title = req.params.title;

  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate("author");
    if (book?.length) {
      res.json(book);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint de creación

bookRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = new Book(req.body);
    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar

bookRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const bookDeleted = await Book.findByIdAndDelete(id);
    if (bookDeleted) {
      res.json(bookDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint update

bookRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (bookUpdated) {
      res.json(bookUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});
