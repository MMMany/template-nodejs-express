const request = require("supertest");
const express = require("express");
const z = require("zod");
const _ = require("lodash");

const { validateBody, validateQuery, validateParams } = require("#/middlewares/validator");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/test/validator/body",
  validateBody(
    z.object({
      name: z.string().nonempty(),
      email: z.email().nonempty(),
    }),
  ),
  (req, res) => {
    res.json(req.body);
  },
);

app.get(
  "/test/validator/query",
  validateQuery(
    z.object({
      name: z.string().nullish(),
      limit: z.coerce.number().nullish(),
    }),
  ),
  (req, res) => {
    res.json(req.query);
  },
);

app.get(
  "/test/validator/params/:id",
  validateParams(
    z.object({
      id: z.string().regex(/^[a-zA-Z0-9]{1,10}$/),
    }),
  ),
  (req, res) => {
    res.json(req.params);
  },
);

describe("Validator test", () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe("body validator", () => {
    it("normal case", async () => {
      const payload = {
        name: "test",
        email: "test@sample.com",
      };
      const response = await request(app).post("/test/validator/body").send(payload);
      expect(response.body).toStrictEqual(payload);
    });
    it("abnormal case: missing value", async () => {
      const response = await request(app).post("/test/validator/body").send({
        name: "test",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("query validator", () => {
    it("normal case", async () => {
      const query = {
        name: "test",
        limit: 10,
      };
      const response = await request(app).get("/test/validator/query").query(query);
      expect(response.body).toStrictEqual(query);
    });
    it("abnormal case: ignore unknown query", async () => {
      const query = {
        name: "test",
        other: "asdf",
      };
      const response = await request(app).get("/test/validator/query").query(query);
      expect(response.body).toStrictEqual(_.omit(query, ["other"]));
    });
    it("abnormal case: wrong type", async () => {
      const query = {
        limit: "asdf",
      };
      const response = await request(app).get("/test/validator/query").query(query);
      expect(response.status).toBe(400);
    });
  });

  describe("params validator", () => {
    it("normal case", async () => {
      const response = await request(app).get("/test/validator/params/1234");
      expect(response.body).toStrictEqual({ id: "1234" });
    });
    it("abnormal case: invalid id", async () => {
      const response = await request(app).get("/test/validator/params/123-123");
      expect(response.status).toBe(400);
    });
  });
});
