import { bookRouter } from "./routes/book.routes";
import { authorRouter } from "./routes/author.routes";

import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";
import { connect } from "./db";

const main = async (): Promise<void> => {
  // Conexión a BBDD
  const database = await connect();

  // Configuración del server

  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    res.send(`Esta es la home de nuestra API. Estamos utilizando la BBDD de ${database?.connection?.name as string}`);
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Vaya!! no hemos encontrado la ruta, busca en GoogleMaps");
  });

  // Middleware de logs en consola
  app.use((req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`Peticion de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
    next();
  });

  // Usamos las rutas
  app.use("/book", bookRouter);
  app.use("/author", authorRouter);
  app.use("public", express.static("public"));
  app.use("/", router);

  // Middleware de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO ERROR ***");
    console.log(`PETICION FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN ERROR ***");

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
void main();
