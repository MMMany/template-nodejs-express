const request = require("supertest");
const express = require("express");
const z = require("zod");
const { omit } = require("lodash");

const { validateBody, validateQuery, validateParams } = require("#/middlewares/validator");
const idSchema = z.string().regex(/^[a-zA-Z0-9]{24}$/);
const validator = {
  body1: validateBody(z.object({ name: z.string().nonempty(), email: z.email().nonempty() })),
  body2: validateBody({ name: z.string().nonempty(), email: z.email().nonempty() }),
  params1: validateParams(z.object({ id: idSchema })),
  params2: validateParams({ id: idSchema }),
  query1: validateQuery(z.object({ name: z.string().nullish(), limit: z.coerce.number().nullish() })),
  query2: validateQuery({ name: z.string().nullish(), limit: z.coerce.number().nullish() }),
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API = {
  BODY1: "/test/validate-body-1",
  BODY2: "/test/validate-body-2",
  PARAMS1: "/test/validate-params-1/:id",
  PARAMS2: "/test/validate-params-2/:id",
  QUERY1: "/test/validate-query-1",
  QUERY2: "/test/validate-query-2",
};

app.post(API.BODY1, validator.body1, (req, res) => res.json(req.body));
app.post(API.BODY2, validator.body2, (req, res) => res.json(req.body));
app.get(API.PARAMS1, validator.params1, (req, res) => res.json(req.params));
app.get(API.PARAMS2, validator.params2, (req, res) => res.json(req.params));
app.get(API.QUERY1, validator.query1, (req, res) => res.json(req.query));
app.get(API.QUERY2, validator.query2, (req, res) => res.json(req.query));

describe("Validator test", () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe("create validator", () => {
    it("normal case", async () => {
      let pass;
      try {
        const validator = validateBody({ id: z.string() });
        await validator(
          //@ts-ignore
          { body: { id: "test" } },
          null,
          () => {
            pass = true;
          },
        );
      } catch {
        pass = false;
      }
      expect(pass).toBe(true);
    });

    it("abnormal case: failed parsing as ZodType", async () => {
      let pass;
      let statusCode;
      try {
        const validator = validateBody(["unexpected"]);
        await validator(
          //@ts-ignore
          { body: { id: z.string() } },
          //@ts-ignore
          {
            sendStatus: (code) => {
              pass = true;
              statusCode = code;
            },
          },
          null,
        );
      } catch {
        pass = false;
        statusCode = -1;
      }
      expect(pass).toBe(true);
      expect(statusCode).toBe(400);
    });
  });

  describe("body validator", () => {
    const baseBody = {
      name: "test",
      email: "test@test.com",
    };

    it("normal case: schema 1", async () => {
      const response = await request(app).post(API.BODY1).send(baseBody);
      expect(response.body).toStrictEqual(baseBody);
    });

    it("normal case: schema 2", async () => {
      const response = await request(app).post(API.BODY2).send(baseBody);
      expect(response.body).toStrictEqual(baseBody);
    });

    it("abnormal case: invalid body", async () => {
      const response = await request(app).post(API.BODY1).send({
        name: "test",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("params validator", () => {
    const id = "123123".repeat(4);

    it("normal case: schema 1", async () => {
      const response = await request(app).get(API.PARAMS1.replaceAll(":id", id));
      expect(response.body).toStrictEqual({ id });
    });

    it("normal case: schema 2", async () => {
      const response = await request(app).get(API.PARAMS2.replaceAll(":id", id));
      expect(response.body).toStrictEqual({ id });
    });

    it("abnormal case: invalid id", async () => {
      const response = await request(app).get(API.PARAMS1.replaceAll(":id", "invalid-id"));
      expect(response.status).toBe(400);
    });
  });

  describe("query validator", () => {
    const baseQuery = {
      name: "test",
      limit: 10,
    };

    it("normal case: schema 1", async () => {
      const response = await request(app).get(API.QUERY1).query(baseQuery);
      expect(response.body).toStrictEqual(baseQuery);
    });

    it("normal case: schema 2", async () => {
      const response = await request(app).get(API.QUERY2).query(baseQuery);
      expect(response.body).toStrictEqual(baseQuery);
    });

    it("abnormal case: ignore unknown query", async () => {
      const query = { ...baseQuery, other: "other value" };
      const response = await request(app).get(API.QUERY1).query(query);
      expect(response.body).toStrictEqual(omit(query, ["other"]));
    });

    it("abnormal case: wrong type", async () => {
      const query = { limit: "asdf" };
      const response = await request(app).get(API.QUERY1).query(query);
      expect(response.status).toBe(400);
    });
  });
});
