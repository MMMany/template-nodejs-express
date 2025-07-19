// tests/sample.test.js

import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("Sample Test", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    jest.resetModules();
  });

  describe("GET /api/sample", () => {
    it("should return 200 OK", async () => {
      const response = await request(app).get("/api/sample");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello World!");
    });
  });

  describe("POST /api/sample", () => {
    it("send valid data, should return 200 OK", async () => {
      const response = await request(app).post("/api/sample").send({
        message: "Hello World!",
      });
      expect(response.status).toBe(200);
      expect(response.text).toBe("message received : Hello World!");
    });

    it("send invalid data, should return 400 Bad Request", async () => {
      const response = await request(app).post("/api/sample").send({});
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/unknown", () => {
    it("should return 404 Not Found", async () => {
      const response = await request(app).get("/api/unknown");
      expect(response.status).toBe(404);
    });
  });
});
