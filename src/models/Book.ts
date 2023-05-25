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
          maxLength: [20, "Ese pais no se puede pronunciar"],
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
