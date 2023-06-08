import { mongoConnect } from "../src/databases/mongo-db";
import mongoose from "mongoose";
import { app, server } from "../src/index";
import { type IAuthor } from "../src/models/mongo/Author";
import request from "supertest";

describe("Author controller", () => {
  const authorMock: IAuthor = {
    name: "Miguel",
    country: "SPAIN",
    email: "miguelin@example.com",
    password: "12345678",
    authorImage: "string",
  };

  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("Simple test to check jest in working", () => {
    expect(true).toBeTruthy();
  });

  it("Simple test to check jest in working", () => {
    const miTexto = "Hola chicos";
    expect(miTexto.length).toBe(11);
  });

  it("POST /author - this should create an author", async () => {
    const response = await request(app).post("/author").send(authorMock).set("Accept", "application/json").expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(authorMock.email);
  });
});
