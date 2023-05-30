import mongoose from "mongoose";
import { connect } from "../db";
import { Book } from "../models/Book";
import { faker } from "@faker-js/faker";

const bookList: any = [];

// Creamos libros adicionales
for (let i = 0; i < 50; i++) {
  const newBook = {
    title: "The " + faker.word.adjective(5) + " " + faker.word.noun(10),
    pages: faker.number.int({ max: 3031, min: 1 }),
    publisher: {
      name: faker.company.name(),
      country: faker.location.country(),
    },
  };
  bookList.push(newBook);
}

const bookSeed = async (): Promise<void> => {
  try {
    // Conectar a BBDD
    await connect();
    console.log("Tenemos conexión");
    // Borrar datos
    await Book.collection.drop();
    console.log("Libros eliminados");
    // Añadir libros
    const documents = bookList.map((book: any) => new Book(book));
    await Book.insertMany(documents);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};
void bookSeed();
