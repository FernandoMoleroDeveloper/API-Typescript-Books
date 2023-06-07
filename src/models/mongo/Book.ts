/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: "object"
 *       required:
 *         - title
 *         - pages
 *       properties:
 *         title:
 *           type: "string"
 *           minLength: 3
 *           maxLength: 20
 *           description: "Título del libro. Debe tener al menos 3 caracteres y no más de 20."
 *         author:
 *           type: "string"
 *           format: "uuid"
 *           description: "ID del autor del libro. No es obligatorio."
 *           nullable: true
 *         pages:
 *           type: "integer"
 *           minimum: 10
 *           maximum: 10000
 *           description: "Número de páginas del libro. Debe ser al menos 10 y no más de 10000."
 *         publisher:
 *           type: "object"
 *           properties:
 *             name:
 *               type: "string"
 *               description: "Nombre del editor."
 *             country:
 *               type: "string"
 *               minLength: 3
 *               maxLength: 40
 *               description: "País del editor. Debe tener al menos 3 caracteres y no más de 40."
 *           required:
 *             - "name"
 *             - "country"
 *           nullable: true
 */

import mongoose, { type ObjectId } from "mongoose";
const Schema = mongoose.Schema;

// Creamos el schema del libro
export interface IBook {
  title: string;
  author: ObjectId;
  pages: number;
  publisher: {
    name: string;
    country: string;
  };
}
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Dame más detalle que 3 es una mierda"],
      maxLength: [20, "eso es too much pa el body"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: false,
    },
    pages: {
      type: Number,
      required: true,
      min: [10, "Eso ni es libro ni es na"],
      max: [10000, "Con tantas páginas eso es infumable"],
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
          minLength: [3, "Ese pais no puede existir"],
          maxLength: [40, "Ese pais no se puede pronunciar"],
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<IBook>("Book", bookSchema);
