import express from "express";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcrypt";
// Modelos
import { Author } from "../models/mongo/Author";
import { Book } from "../models/mongo/Book";
import { isAuth } from "../middlewares/auth.middleware";
import { generateToken } from "../utils/token";
import { type Request, type Response, type NextFunction } from "express";
const upload = multer({ dest: "public" });

// Router propio de usuarios
export const authorRouter = express.Router();

// CRUD: READ
authorRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
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
authorRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = req.query.page as any;
    const limit: number = req.query.limit as any;

    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);
    if (author) {
      const temporalAuthor = author.toObject();
      const includeBooks = req.query.includeBooks === "true";

      if (includeBooks) {
        const books = await Book.find({ author: id });
        temporalAuthor.books = books;
      }
      res.json(temporalAuthor);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/name/:name", async (req: Request, res: Response, next: NextFunction) => {
  const name = req.params.name;

  try {
    const author = await Author.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (author?.length) {
      res.json(author);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint de creación

authorRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = new Author(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar

authorRouter.delete("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      return res.status(404).json({ error: "No tienes autorizacion para realizar esta operacion" });
    }
    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint update

authorRouter.put("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      return res.status(404).json({ error: "No tienes autorizacion para realizar esta operacion" });
    }

    const authorToUpdate = await Author.findById(id);
    if (authorToUpdate) {
      Object.assign(authorToUpdate, req.body);
      await authorToUpdate.save();
      // quitamos pass de la respuesta
      const authorToSend: any = authorToUpdate.toObject();
      delete authorToSend.password;
      res.json(authorToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.post("/image-upload", upload.single("image"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Renombrado de la imagen
    const originalname = req.file?.originalname as string;
    const path = req.file?.path as string;
    const newPath = `${path}_${originalname}`;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const authorId = req.body.authorId;
    const author = await Author.findById(authorId);

    if (author) {
      author.authorImage = newPath;
      await author.save();
      res.json(author);

      console.log("Author modificado correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("author no encontrado");
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      return res.status(401).json({ error: "Email y/o password incorrectos" });
    }
    const match = await bcrypt.compare(password, author.password);
    if (match) {
      const authorWithoutPass: any = author.toObject();
      delete authorWithoutPass.password;

      const jwtToken = generateToken(author._id.toString(), author.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o password incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});
