import request from "supertest";
import { bootstrap } from "#/app";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await bootstrap();
});

describe("AdminCartController", () => {
  describe("GET /api/tests/bad-request", () => {
    it("returns a status code 400 if the bad request test is successful", async () => {
      const response = await request(app).get("/api/tests/bad-request");

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: "An error occurred.",
        code: "TEST_BAD_REQUEST",
      });
    });
  });

  describe("GET /api/tests/dependency-injection", () => {
    it("returns a status code 200 if the dependency injection is successful", async () => {
      const response = await request(app).get(
        "/api/tests/dependency-injection"
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        commissionRate: 25,
        message:
          "message received from another module's injected service: Hello World",
      });
    });
  });
});
