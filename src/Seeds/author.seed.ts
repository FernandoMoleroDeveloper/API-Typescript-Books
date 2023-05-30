import mongoose from "mongoose";
import { connect } from "../db.js";
import { Author } from "../models/Author.js";

const authorSeed = async (): Promise<void> => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Author.collection.drop();
    console.log("Authors borrados");

    const authorList = [
      { name: "Gabriel García Márquez", country: "Colombia", email: "gabriel@gmail.com", password: "12345678" },
      { name: "Jane Austen", country: "England", email: "jane@gmail.com", password: "11111111" },
      { name: "Leo Tolstoy", country: "Russia", email: "leo@gmail.com", password: "99999999" },
      { name: "Virginia Woolf", country: "England", email: "virginia@gmail.com", password: "22222222" },
      { name: "Ernest Hemingway", country: "United States", email: "ernest@gmail.com", password: "33333333" },
      { name: "Jorge Luis Borges", country: "Argentina", email: "jorge@gmail.com", password: "44444444" },
      { name: "Franz Kafka", country: "Czechoslovakia", email: "franz@gmail.com", password: "55555555" },
      { name: "Toni Morrison", country: "United States", email: "toni@gmail.com", password: "66666666" },
      { name: "Haruki Murakami", country: "Japan", email: "haruki@gmail.com", password: "77777777" },
      { name: "Chinua Achebe", country: "Nigeria", email: "chinua@gmail.com", password: "88888888" },
    ];

    // Añadimos libros
    const documents = authorList.map((author) => new Author(author));
    // await Author.insertMany(documents);

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log("Datos authors guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    void mongoose.disconnect();
  }
};

void authorSeed();
