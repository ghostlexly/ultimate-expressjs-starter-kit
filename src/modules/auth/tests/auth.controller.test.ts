import { bootstrap } from "@/app";
import { authService } from "@/common/services/auth.service";
import { initializeTestDb } from "@/common/test/jest-initialize-db";
import { getAdminUserAccessToken } from "@/common/test/jest-utils";
import { Express } from "express";
import request from "supertest";

let app: Express;

beforeAll(async () => {
  app = await bootstrap();
});

beforeEach(async () => {
  // Reset to initial state before each test
  await initializeTestDb();
});

describe("AuthController", () => {
  describe("POST /api/auth/signin", () => {
    it("returns a status code 200 if the signin is successful as admin", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: "contact@lunisoft.fr",
        password: "password",
        role: "ADMIN",
      });

      expect(response.status).toEqual(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it("returns a status code 400 if the role is incorrect", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: "contact@lunisoft.fr",
        password: "password",
        role: "INCORRECT-ROLE",
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "Invalid enum value. Expected 'ADMIN' | 'CUSTOMER', received 'INCORRECT-ROLE'"
      );
    });

    it("returns a status code 400 if the password is incorrect", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: "contact@lunisoft.fr",
        password: "password-incorrect",
        role: "ADMIN",
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "Mot de passe ou e-mail incorrect."
      );
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("returns a status code 200 if the refresh token has been refreshed", async () => {
      const refreshToken = await getAdminUserAccessToken();

      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken,
      });

      expect(response.status).toEqual(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it("returns a status code 400 if the refresh token is invalid", async () => {
      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken: "invalid-refresh-token",
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "Invalid or expired refresh token."
      );
    });

    it("returns a status code 400 if the refresh token is expired", async () => {
      // Generate the JWT refresh token
      const expiredRefreshToken = await authService.signJwt({
        payload: {
          sub: "1234",
        },
        options: {
          expiresIn: `-1m`,
        },
      });

      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken: expiredRefreshToken,
      });

      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "Invalid or expired refresh token."
      );
    });
  });
});
