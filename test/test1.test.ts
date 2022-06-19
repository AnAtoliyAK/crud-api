// we will use supertest to test HTTP requests/responses
import request from "supertest";
// we also need our app for the correct routes!
import app from "../dist/server.js";

describe("GET / ", () => {
    test("It should respond with an array of students", async () => {
      const response = await request(app).get("/");
      expect(response.body).toEqual([]);
      expect(response.statusCode).toBe(200);
    });
  });
  