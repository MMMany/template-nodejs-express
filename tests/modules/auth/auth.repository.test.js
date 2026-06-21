const createUserRepository = require("../../../src/modules/auth/auth.repository");
const User = require("../../../src/modules/auth/models/User");
const Role = require("../../../src/modules/auth/models/Role");

jest.mock("../../../src/modules/auth/models/User");
jest.mock("../../../src/modules/auth/models/Role");
jest.mock("../../../src/utils/logger", () => ({ error: jest.fn() }));

describe("Auth Module: auth.repository", () => {
  let repository;
  beforeEach(() => {
    repository = createUserRepository();
    jest.clearAllMocks();
  });

  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    lean: jest.fn(),
  };

  const testUserOps = [
    {
      method: "createUser",
      args: [{ userId: "1" }],
      model: User,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({ uid: "1" });
        User.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "createUser",
      args: [{ userId: "1" }],
      model: User,
      modelMethod: "create",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce(null);
        User.findOneAndUpdate.mockReturnValue(mockQuery);
        User.create.mockResolvedValueOnce({ toObject: () => ({ uid: "1" }) });
      },
    },
    {
      method: "findUsers",
      args: [{ userId: "1", name: "2", org: "3" }],
      model: User,
      modelMethod: "find",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce([]);
        User.find.mockReturnValue(mockQuery);
      },
    },
    {
      method: "getUser",
      args: ["uid"],
      model: User,
      modelMethod: "findOne",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOne.mockReturnValue(mockQuery);
      },
    },
    {
      method: "getUserByUserId",
      args: ["uid"],
      model: User,
      modelMethod: "findOne",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOne.mockReturnValue(mockQuery);
      },
    },
    {
      method: "updateUserInfo",
      args: ["uid", {}],
      model: User,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "updateUserRoles",
      args: ["uid", []],
      model: User,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "updatePassword",
      args: ["uid", "pw", "code"],
      model: User,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "deleteUser",
      args: ["uid"],
      model: User,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        User.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "setResetCode",
      args: ["uid", "code"],
      model: User,
      modelMethod: "updateOne",
      mockImpl: () => {
        User.updateOne.mockResolvedValueOnce({ modifiedCount: 1 });
      },
    },
    {
      method: "increaseTokenVersion",
      args: ["uid"],
      model: User,
      modelMethod: "updateOne",
      mockImpl: () => {
        User.updateOne.mockResolvedValueOnce({ modifiedCount: 1 });
      },
    },
  ];

  const testRoleOps = [
    {
      method: "createRole",
      args: [{ key: "R" }],
      model: Role,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({ key: "R" });
        Role.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "createRole",
      args: [{ key: "R" }],
      model: Role,
      modelMethod: "create",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce(null);
        Role.findOneAndUpdate.mockReturnValue(mockQuery);
        Role.create.mockResolvedValueOnce({ toObject: () => ({ key: "R" }) });
      },
    },
    {
      method: "findRoles",
      args: [{ key: "1", name: "2", desc: "3" }],
      model: Role,
      modelMethod: "find",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce([]);
        Role.find.mockReturnValue(mockQuery);
      },
    },
    {
      method: "getRole",
      args: ["key"],
      model: Role,
      modelMethod: "findOne",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        Role.findOne.mockReturnValue(mockQuery);
      },
    },
    {
      method: "updateRole",
      args: ["key", {}],
      model: Role,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        Role.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
    {
      method: "deleteRole",
      args: ["key"],
      model: Role,
      modelMethod: "findOneAndUpdate",
      mockImpl: () => {
        mockQuery.lean.mockResolvedValueOnce({});
        Role.findOneAndUpdate.mockReturnValue(mockQuery);
      },
    },
  ];

  [...testUserOps, ...testRoleOps].forEach(({ method, args, model, modelMethod, mockImpl }) => {
    describe(method, () => {
      test(`성공`, async () => {
        mockImpl();
        await repository[method](...args);
        expect(model[modelMethod]).toHaveBeenCalled();
      });
      test(`에러 발생 시 null/false 반환`, async () => {
        model[modelMethod].mockImplementation(() => {
          throw new Error();
        });
        const res = await repository[method](...args);
        if (typeof res === "boolean") expect(res).toBe(false);
        else expect(res).toBeNull();
      });
      test(`에러에 stack이 없을 때도 에러 로깅 후 null/false 반환`, async () => {
        model[modelMethod].mockImplementation(() => {
          const err = new Error("No stack error");
          delete err.stack;
          throw err;
        });
        const res = await repository[method](...args);
        if (typeof res === "boolean") expect(res).toBe(false);
        else expect(res).toBeNull();
      });
    });
  });
});
