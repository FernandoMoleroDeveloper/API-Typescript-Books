import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { type IBook } from "./Book";
const Schema = mongoose.Schema;

// Creamos el schema del libro
const allowedCountries: string[] = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "NIGERIA", "SPAIN", "JAPAN"];

export interface IAuthor {
  name: string;
  country: string;
  authorImage: string;
  email: string;
  password: string;
  books?: IBook[];
}

const authorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El nombre tiene que tener al menos 3 letras, sino no es nombre"],
      maxLength: [30, "El nombre no puede tener tantas letras, menudo coñazo"],
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Ese pais no puede existir"],
      maxLength: [20, "Ese pais no se puede pronunciar"],
      enum: allowedCountries,
      uppercase: true,
    },
    authorImage: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 carácteres"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

export const Author = mongoose.model<IAuthor>("Author", authorSchema);
