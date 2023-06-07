import { type SwaggerOptions } from "swagger-ui-express";

export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Libros",
      version: "1.0.0",
      description: "API de Libros con NodeJS, Express y MongoDB",
      license: {
        name: "MIT",
        url: "http://mit.com",
      },
      contact: {
        name: "Fernando",
        url: "https://github.com/FernandoMoleroDeveloper",
        email: "fmoleromartin@gmail.com",
      },
    },
    server: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/mongo/*.ts"],
};
