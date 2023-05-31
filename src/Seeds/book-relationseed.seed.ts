import mongoose from "mongoose";
import { mongoConnect } from "../databases/mongo-db.js";
import { Book } from "../models/mongo/Book.js";
import { generateRandom } from "../utils/utils";
import { Author } from "../models/mongo/Author.js";

const bookReslationsSeed = async (): Promise<void> => {
  try {
    await mongoConnect();
    console.log("Tenemos conexión!");

    // Recuperamos libros y autores
    const books = await Book.find();
    const authors = await Author.find();

    // Comprobar que existen libros
    if (!books.length) {
      console.error("No hay libros para relacionar en la base de datos");
      return;
    }

    if (!authors.length) {
      console.error("No hay autores para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const randomAuthors = authors[generateRandom(0, authors.length - 1)];
      book.author = randomAuthors.id;
      await book.save();
    }

    console.log("Relaciones entre libros-autores creadas correctamente.");
  } catch (error) {
    console.error(error);
  } finally {
    void mongoose.disconnect();
  }
};

void bookReslationsSeed();
