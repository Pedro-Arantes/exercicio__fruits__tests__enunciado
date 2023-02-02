import supertest from "supertest";
import app from "../src/index";
import { Fruit } from "repositories/fruits-repository";
import fruits from "data/fruits";

const server = supertest(app);

beforeEach( () => { 
    const id = fruits.length + 1;
    fruits.push({ 
        name: "apple",
        price: 200, 
        id 
    });
 });

afterEach( () => {
    fruits.splice(0,fruits.length); 
})

 describe("POST/fruits route tests ", () => {
  it("should respond with status 409 when body send has already been added to database", async () => {
    const body = { 
      name: "apple",
      price: 200, 
    }
    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(409);
  })
  it("should respond with status 422 when body sent is incorrect", async () => {
    const body = { 
      name: "Banana"
  }
    const result = await server.post("/fruits").send(body);
    const status = result.status;

    expect(status).toBe(422);
  });
  it("should respond with status 201 when body sent is correct ", async () => {
    const body = { 
      name: "Banana",
      price: 200
    }
    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(201);
  });
});
 
 describe("GET /fruits route tests ", () => {
  it("should respond with the correct status when fetching objects from database", async () => {
    const result = await server.get("/fruits");
    const status = result.status;

    if (result.body.length === 0) {
      expect(result.body).toEqual(expect.arrayContaining([]));
    }

    expect(status).toBe(200);
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
          id: expect.any(Number),
        }),
      ])
    );
  });
});

describe("GET /fruits/:id route tests", () => {
  it("should respond with status 404 when fruit doesn't exist", async () => {
    const result = await server.get("/fruits/0");
    expect(result.status).toBe(404);
  });

  it("should respond with status 200 with specific fruit exists", async () => {
    const result = await server.get("/fruits/1");
    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        price: expect.any(Number),
        id: expect.any(Number),
      })
    );
  });
});
 