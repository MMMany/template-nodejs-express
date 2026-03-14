const request = require("supertest");
const app = require("#/main");
const { connectAllDb, closeAllDb } = require("#/db");

describe("Users module test", () => {
  const ctx = {
    /** @type {UserModule.CreateUserDTO} */
    userInfo: {
      userId: "api-test",
      name: "API Tester",
      password: "password",
      email: "api-tester@sample.com",
    },
    /** @type {UserModule.CommonUserResponse} */
    userData: null,
  };

  beforeAll(async () => {
    await connectAllDb();
  });

  afterAll(async () => {
    await closeAllDb();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe("create new user", () => {
    it("normal case", async () => {
      const response = await request(app).post("/api/users").send(ctx.userInfo);
      expect(response.status).toBe(200);
      expect(response.body?.userId).toStrictEqual(ctx.userInfo.userId);
    });

    it("abnormal case", async () => {
      const response = await request(app).post("/api/users").send({
        userId: "invalid id format",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("find user", () => {
    it("normal case: find all users", async () => {
      const response = await request(app).get("/api/users");
      expect(response.body).toHaveProperty("length");
      expect(response.body).toHaveLength(1);
      const user = response.body[0];
      expect(user.userId).toBe(ctx.userInfo.userId);
      ctx.userData = user;
    });

    it("normal case: get user profile", async () => {
      const uid = ctx.userData.uid;
      const response = await request(app).get(`/api/users/${uid}`);
      expect(response.body).toHaveProperty("userId");
      expect(response.body.userId).toBe(ctx.userInfo.userId);
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
      const uid = ctx.userData.uid;
      ctx.userInfo.name = "modified user name";
      ctx.userInfo.email = "modified@sample.com";
      const payload = {
        name: ctx.userInfo.name,
        email: ctx.userInfo.email,
      };
      const response = await request(app).patch(`/api/users/${uid}`).send(payload);
      expect(response.body).toHaveProperty("uid");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body.name).toBe(payload.name);
      expect(response.body.email).toBe(payload.email);
      ctx.userData = response.body;
    });

    it("normal case: not modified", async () => {
      const uid = ctx.userData.uid;
      const payload = {
        name: ctx.userInfo.name,
        email: ctx.userInfo.email,
      };
      const response = await request(app).patch(`/api/users/${uid}`).send(payload);
      expect(response.status).toBe(304);
    });

    it("abnormal case: invalid uid", async () => {
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
      const uid = ctx.userData.uid;
      const response = await request(app).patch(`/api/users/${uid}`);
      expect(response.status).toBe(400);
    });
  });

  describe("update user permissions", () => {
    it("normal case: add permissions", async () => {
      const uid = ctx.userData.uid;
      const payload = {
        add: ["perm-1", "perm-2"],
      };
      const response = await request(app).patch(`/api/users/${uid}/permissions`).send(payload);
      expect(response.body).toHaveProperty("permissions");
      expect(response.body.permissions).toHaveLength(2);
      expect(response.body.permissions).toContain("perm-1");
      expect(response.body.permissions).toContain("perm-2");
      ctx.userData = response.body;
    });

    it("normal case: add & remove permissions", async () => {
      const uid = ctx.userData.uid;
      const payload = {
        add: ["perm-3"],
        remove: ["perm-2"],
      };
      const response = await request(app).patch(`/api/users/${uid}/permissions`).send(payload);
      expect(response.body).toHaveProperty("permissions");
      expect(response.body.permissions).toHaveLength(2);
      expect(response.body.permissions).toContain("perm-1");
      expect(response.body.permissions).toContain("perm-3");
      ctx.userData = response.body;
    });

    it("normal case: not modified", async () => {
      const uid = ctx.userData.uid;
      const response = await request(app)
        .patch(`/api/users/${uid}/permissions`)
        .send({
          add: ["perm-12"],
          remove: ["perm-12"],
        });
      expect(response.status).toBe(304);
    });

    it("abnormal case: no data", async () => {
      const uid = ctx.userData.uid;
      const response = await request(app).patch(`/api/users/${uid}/permissions`);
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
      const uid = ctx.userData.uid;
      const response = await request(app).delete(`/api/users/${uid}`);
      expect(response.body).toHaveProperty("userId");
      expect(response.body.userId).toBe(ctx.userInfo.userId);
    });

    it("abnormal case: invalid uid", async () => {
      const response = await request(app).delete(`/api/users/12341234`);
      expect(response.status).toBe(400);
    });

    it("abnormal case: not exists user", async () => {
      const response = await request(app).delete(`/api/users/${"123456".repeat(4)}`);
      expect(response.status).toBe(404);
    });
  });

  describe("invalid API request", () => {
    it("request unknown API", async () => {
      const response = await request(app).get("/api/something/unknown");
      expect(response.status).toBe(400);
    });
  });
});
