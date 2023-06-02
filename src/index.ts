import { bookRouter } from "./routes/book.routes";
import { authorRouter } from "./routes/author.routes";
import { companiesRouter } from "./routes/companies.routes";
import { AppDataSource } from "./databases/typeorm-datasource";
import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";

import express from "express";
import cors from "cors";
import { mongoConnect } from "./databases/mongo-db";
import { sqlConnect } from "./databases/sql-db";
import { studentRouter } from "./routes/student.routes";
import { courseRouter } from "./routes/course.routes";

const main = async (): Promise<void> => {
  // Conexión a BBDD
  const sqlDatabase = await sqlConnect();
  const mongoDatabase = await mongoConnect();
  const dataSource = await AppDataSource.initialize();

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
    res.send(`
    <h3>Esta es la home de nuestra API.</h3>
    <p>Estamos utilizando la BBDD de Mongo ${mongoDatabase?.connection?.name as string}</p>
    <p>Estamos utilizando la BBDD de SQL ${sqlDatabase?.config?.database as string} del host ${sqlDatabase?.config?.host as string}</p>
    <p>Estamos utilizando la BBDD de TypeORM ${dataSource?.options?.database as string}</p>
    `);
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
  app.use("/technoCompanies", companiesRouter);
  app.use("/students", studentRouter);
  app.use("/course", courseRouter);
  app.use("public", express.static("public"));
  app.use("/", router);

  // Middleware de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO ERROR ***");
    console.log(`PETICION FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN ERROR ***");

    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsd?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
void main();
