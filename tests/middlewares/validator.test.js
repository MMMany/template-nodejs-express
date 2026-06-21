const { validateBody, validateParams, validateQuery } = require("../../src/middlewares/validator");
const z = require("zod");
const { faker } = require("@faker-js/faker");

jest.mock("../../src/utils/logger", () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("Middlewares: validator", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, valid: {} };
    res = { sendStatus: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  describe("validateBody", () => {
    /**
     * @description 유효한 body 값이 들어왔을 때 req.valid.body에 데이터를 담고 next()를 호출하는지 테스트합니다.
     */
    test("올바른 body 데이터가 들어오면 next()를 호출해야 합니다", () => {
      const middleware = validateBody(schema);
      req.body = { name: faker.person.fullName(), age: 25 };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.valid.body).toEqual(req.body);
    });

    /**
     * @description 잘못된 body 값이 들어왔을 때 400 에러를 반환하는지 테스트합니다.
     */
    test("잘못된 body 데이터가 들어오면 400 상태 코드를 반환해야 합니다", () => {
      const middleware = validateBody(schema);
      req.body = { name: 123 }; // 잘못된 타입

      middleware(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    /**
     * @description Zod 스키마가 아닌 잘못된 스키마가 들어갔을 때 에러를 잡아서 400을 반환하는지 테스트합니다.
     */
    test("잘못된 스키마 객체 전달 시 ZodSchemaError가 발생하여 400을 반환해야 합니다", () => {
      const middleware = validateBody("invalid-schema");

      middleware(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateParams", () => {
    /**
     * @description 유효한 params 값이 들어왔을 때 req.valid.params에 데이터를 담고 next()를 호출하는지 테스트합니다.
     */
    test("올바른 params 데이터가 들어오면 next()를 호출해야 합니다", () => {
      const middleware = validateParams(schema);
      req.params = { name: faker.person.fullName(), age: 30 };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.valid.params).toEqual(req.params);
    });

    /**
     * @description 잘못된 params 값이 들어왔을 때 400 에러를 반환하는지 테스트합니다.
     */
    test("잘못된 params 데이터가 들어오면 400 상태 코드를 반환해야 합니다", () => {
      const middleware = validateParams(schema);
      req.params = { name: faker.person.fullName(), age: "30" }; // 숫자가 아님

      middleware(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateQuery", () => {
    /**
     * @description 유효한 query 값이 들어왔을 때 req.valid.query에 데이터를 담고 next()를 호출하는지 테스트합니다.
     */
    test("올바른 query 데이터가 들어오면 next()를 호출해야 합니다", () => {
      const middleware = validateQuery(schema);
      req.query = { name: faker.person.fullName(), age: 20 };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.valid.query).toEqual(req.query);
    });

    /**
     * @description 잘못된 query 값이 들어왔을 때 400 에러를 반환하는지 테스트합니다.
     */
    test("잘못된 query 데이터가 들어오면 400 상태 코드를 반환해야 합니다", () => {
      const middleware = validateQuery(schema);
      req.query = { missingAge: true };

      middleware(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
