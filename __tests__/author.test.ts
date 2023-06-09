import { mongoConnect } from "../src/databases/mongo-db";
import mongoose from "mongoose";
import { app, server } from "../src/index";
import { Author, type IAuthor } from "../src/models/mongo/Author";
import request from "supertest";

describe("Author controller", () => {
  const authorMock: IAuthor = {
    name: "Miguel",
    country: "SPAIN",
    email: "miguelin@example.com",
    password: "12345678",
    authorImage: "string",
  };

  let token: string;
  let authorId: string;

  beforeAll(async () => {
    await mongoConnect();
    await Author.collection.drop();
    console.log("Eliminados todos los autores");
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

    authorId = response.body._id;
  });

  it("POST /author/login with valid credentials returns 200 and credentials", async () => {
    const credentials = {
      email: authorMock.email,
      password: authorMock.password,
    };

    const response = await request(app).post("/author/login").send(credentials).expect(200);

    expect(response.body).toHaveProperty("token");
    token = response.body.token;
    console.log(token);
  });

  it("POST /author/login with wrong credentials returns 401 and no token", async () => {
    const credentials = {
      email: "noexisting@example.com",
      password: "1234",
    };

    const response = await request(app).post("/author/login").send(credentials).expect(401);

    expect(response.body.token).toBeUndefined();
  });

  it("GET /author - this should return an array of authors", async () => {
    const response = await request(app).get("/author").expect(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].email).toBe(authorMock.email);
  });

  it("PUT /author/id - Modify author when token is sent", async () => {
    const updatedData = {
      name: "Miguel",
      country: "ENGLAND",
    };

    const response = await request(app).put(`/author/${authorId}`).set("Authorization", `Bearer ${token}`).send(updatedData).expect(200);

    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(authorMock.email);
    expect(response.body._id).toBe(authorId);
  });
  /*
  it("PUT /author/id - Should not modify author when no token is sent", async () => {
    const updatedData = {
      name: "Miguel",
    };

    const response = await request(app).put(`/author/${authorId}`).send(updatedData).expect(401);

    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });
*/
  it("DELETE /author/id - Should delete author when token is sent", async () => {
    const response = await request(app).delete(`/author/${authorId}`).set("Authorization", `Bearer ${token}`).expect(200);

    expect(response.body._id).toBe(authorId);
  });
  /*
  it("DELETE /author/id - Do not delete author when no token is sent", async () => {
    const response = await request(app).delete(`/author/${authorId}`).expect(401);

    expect(response.body.error).toBe("No tienes autorización para realizar esta operación");
  });
  */
});
