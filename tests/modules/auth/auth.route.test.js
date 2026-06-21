const request = require("supertest");
const express = require("express");
const { router } = require("../../../src/modules/auth/auth.route");

// Mocking dependencies to isolate route tests
jest.mock("../../../src/modules/auth/auth.repository", () => {
  return jest.fn().mockImplementation(() => ({}));
});
jest.mock("../../../src/modules/auth/auth.service", () => {
  return jest.fn().mockImplementation(() => ({}));
});
jest.mock("../../../src/modules/auth/auth.controller", () => {
  return jest.fn().mockImplementation(() => ({
    createUser: jest.fn((req, res) => res.status(201).json({ status: "success" })),
    findUsers: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    getUser: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    updateUserInfo: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    updatePassword: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    deleteUser: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    createRole: jest.fn((req, res) => res.status(201).json({ status: "success" })),
    findRoles: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    getRole: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    updateRole: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    deleteRole: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    findPermissions: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    login: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    logout: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    refreshToken: jest.fn((req, res) => res.status(200).json({ status: "success" })),
    logoutAllDevice: jest.fn((req, res) => res.status(200).json({ status: "success" })),
  }));
});
jest.mock("../../../src/middlewares/auth.middleware", () => ({
  validateAuth: jest.fn(() => (req, res, next) => next()), // Mock Auth to always pass
}));
jest.mock("../../../src/middlewares/validator", () => ({
  validateBody: jest.fn(() => (req, res, next) => next()),
  validateQuery: jest.fn(() => (req, res, next) => next()),
  validateParams: jest.fn(() => (req, res, next) => next()),
}));

describe("Auth Module: auth.route", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", router);
    jest.clearAllMocks();
  });

  describe("POST /auth/users", () => {
    /**
     * @description /auth/users 라우트가 올바르게 연결되어 201 응답을 반환하는지 테스트합니다.
     */
    test("올바르게 라우팅되어 컨트롤러를 호출해야 합니다", async () => {
      const response = await request(app).post("/auth/users").send({});
      expect(response.status).toBe(201);
    });
  });

  describe("GET /auth/users", () => {
    /**
     * @description /auth/users GET 라우트가 연결되어 200 응답을 반환하는지 테스트합니다.
     */
    test("올바르게 라우팅되어 컨트롤러를 호출해야 합니다", async () => {
      const response = await request(app).get("/auth/users");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /auth/users/:uid", () => {
    /**
     * @description /auth/users/:uid GET 라우트가 연결되어 200 응답을 반환하는지 테스트합니다.
     */
    test("올바르게 라우팅되어 컨트롤러를 호출해야 합니다", async () => {
      const response = await request(app).get("/auth/users/some-uid");
      expect(response.status).toBe(200);
    });
  });

  describe("POST /auth/login", () => {
    /**
     * @description /auth/login POST 라우트가 연결되어 200 응답을 반환하는지 테스트합니다.
     */
    test("올바르게 라우팅되어 컨트롤러를 호출해야 합니다", async () => {
      const response = await request(app).post("/auth/login").send({});
      expect(response.status).toBe(200);
    });
  });
});
