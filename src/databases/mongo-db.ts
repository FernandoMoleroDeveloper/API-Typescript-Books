// Cargamos variables de entorno
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Cargamos librerias
const DB_CONNECTION: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

// Configuración de la conexión

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

export const mongoConnect = async (): Promise<mongoose.Mongoose | null> => {
  try {
    const database: typeof mongoose = await mongoose.connect(DB_CONNECTION, config);
    const name = database.connection.name;
    const host = database.connection.host;
    console.log(`Concectando a la base de datos ${name} en el host ${host}`);

    return database;
  } catch (error) {
    console.error(error);
    console.log("Error en la conexion intentando conectar en 5 seg ...");
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(mongoConnect, 5000);

    return null;
  }
};
