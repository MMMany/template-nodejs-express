const request = require("supertest");
const app = require("#/main");
const { connectAllDb, closeAllDb } = require("#/db");
const User = require("#/modules/users/models/user.model");

describe("Users module test", () => {
  const ctx = {
    /** @type {UserModule.CreateUserDTO} */
    baseDTO: {
      userId: "api-test",
      name: "API Tester",
      password: "password",
      email: "api-tester@sample.com",
    },
    /** @type {UserModule.UserResponse} */
    userData: null,
  };

  beforeAll(async () => {
    await connectAllDb();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await closeAllDb();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe("create new user", () => {
    it("normal case", async () => {
      const response = await request(app).post("/api/users").send(ctx.baseDTO);
      expect(response.status).toBe(200);
      expect(response.body?.userId).toStrictEqual(ctx.baseDTO.userId);
    });

    it("abnormal case: invalid body", async () => {
      const response = await request(app).post("/api/users").send({
        userId: "invalid id format",
      });
      expect(response.status).toBe(400);
    });

    it("abnormal case: duplicated", async () => {
      const response = await request(app).post("/api/users").send(ctx.baseDTO);
      expect(response.status).toBe(400);
    });
  });

  describe("find user", () => {
    it("normal case: find all users", async () => {
      const response = await request(app).get("/api/users");
      expect(response.body).toHaveProperty("length");
      expect(response.body).toHaveLength(1);
      const user = response.body[0];
      expect(user.userId).toBe(ctx.baseDTO.userId);
      ctx.userData = user;
    });

    it("normal case: get user profile", async () => {
      const id = ctx.userData.id;
      const response = await request(app).get(`/api/users/${id}`);
      expect(response.body).toHaveProperty("userId");
      expect(response.body.userId).toBe(ctx.baseDTO.userId);
    });

    it("abnormal case: no users", async () => {
      const query = {
        userId: "invalid-user",
      };
      const response = await request(app).get("/api/users").query(query);
      expect(response.status).toBe(404);
    });

    it("abnormal case: invalid uid", async () => {
      const response = await request(app).get(`/api/users/12341234`);
      expect(response.status).toBe(400);
    });

    it("abnormal case: user not found", async () => {
      const response = await request(app).get(`/api/users/${"123456".repeat(4)}`);
      expect(response.status).toBe(404);
    });
  });

  describe("update user info", () => {
    it("normal case: update user info", async () => {
      const id = ctx.userData.id;
      ctx.baseDTO.name = "modified user name";
      ctx.baseDTO.email = "modified@sample.com";
      const payload = {
        name: ctx.baseDTO.name,
        email: ctx.baseDTO.email,
      };
      const response = await request(app).patch(`/api/users/${id}`).send(payload);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body.name).toBe(payload.name);
      expect(response.body.email).toBe(payload.email);
      ctx.userData = response.body;
    });

    it("normal case: not modified", async () => {
      const id = ctx.userData.id;
      const payload = {
        name: ctx.baseDTO.name,
        email: ctx.baseDTO.email,
      };
      const response = await request(app).patch(`/api/users/${id}`).send(payload);
      expect(response.status).toBe(304);
    });

    it("abnormal case: invalid id", async () => {
      const response = await request(app).patch(`/api/users/12341234`).send({
        name: "unknown",
      });
      expect(response.status).toBe(400);
    });

    it("abnormal case: user not found", async () => {
      const response = await request(app)
        .patch(`/api/users/${"123456".repeat(4)}`)
        .send({
          name: "not exists user",
        });
      expect(response.status).toBe(404);
    });

    it("abnormal case: no data", async () => {
      const id = ctx.userData.id;
      const response = await request(app).patch(`/api/users/${id}`).send({});
      expect(response.status).toBe(400);
    });
  });

  describe("update user permissions", () => {
    it("normal case: add permissions", async () => {
      const id = ctx.userData.id;
      const payload = {
        add: ["perm-1", "perm-2"],
      };
      const response = await request(app).patch(`/api/users/${id}/permissions`).send(payload);
      expect(response.body).toHaveProperty("permissions");
      expect(response.body.permissions).toHaveLength(2);
      expect(response.body.permissions).toContain("perm-1");
      expect(response.body.permissions).toContain("perm-2");
      ctx.userData = response.body;
    });

    it("normal case: add & remove permissions", async () => {
      const id = ctx.userData.id;
      const payload = {
        add: ["perm-3"],
        remove: ["perm-2"],
      };
      const response = await request(app).patch(`/api/users/${id}/permissions`).send(payload);
      expect(response.body).toHaveProperty("permissions");
      expect(response.body.permissions).toHaveLength(2);
      expect(response.body.permissions).toContain("perm-1");
      expect(response.body.permissions).toContain("perm-3");
      ctx.userData = response.body;
    });

    it("normal case: invalid body", async () => {
      const id = ctx.userData.id;
      const response = await request(app)
        .patch(`/api/users/${id}/permissions`)
        .send({
          add: ["perm-12"],
          remove: ["perm-12"],
        });
      expect(response.status).toBe(400);
    });

    it("normal case: not modified", async () => {
      const id = ctx.userData.id;
      const response = await request(app)
        .patch(`/api/users/${id}/permissions`)
        .send({
          remove: ["perm-999"],
        });
      expect(response.status).toBe(304);
    });

    it("abnormal case: no data", async () => {
      const id = ctx.userData.id;
      const response = await request(app).patch(`/api/users/${id}/permissions`).send({});
      expect(response.status).toBe(400);
    });

    it("abnormal case: user not found", async () => {
      const response = await request(app)
        .patch(`/api/users/${"123456".repeat(4)}/permissions`)
        .send({
          add: ["perm-99"],
        });
      expect(response.status).toBe(404);
    });
  });

  describe("delete user", () => {
    it("normal case", async () => {
      const id = ctx.userData.id;
      const response = await request(app).delete(`/api/users/${id}`);
      expect(response.body).toHaveProperty("userId");
      expect(response.body.userId).toBe(ctx.baseDTO.userId);
    });

    it("abnormal case: invalid uid", async () => {
      const response = await request(app).delete(`/api/users/12341234`);
      expect(response.status).toBe(400);
    });

    it("abnormal case: not exists user", async () => {
      const response = await request(app).delete(`/api/users/${"123456".repeat(4)}`);
      expect(response.status).toBe(400);
    });
  });

  describe("invalid API request", () => {
    it("request unknown API", async () => {
      const response = await request(app).get("/api/something/unknown");
      expect(response.status).toBe(400);
    });
  });
});
