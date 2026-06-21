const createUserService = require("../../../src/modules/auth/auth.service");
const bcrypt = require("bcrypt");
const jwtUtils = require("../../../src/utils/jwt");
const {
  HttpNotFound,
  HttpBadRequest,
  HttpUnauthorized,
  HttpInternalServerError,
} = require("../../../src/utils/http-errors");

jest.mock("bcrypt");
jest.mock("uuid", () => ({
  v7: jest.fn(() => "mock-uuid-v7"),
}));
jest.mock("../../../src/utils/jwt", () => ({
  generateToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));
jest.mock("../../../src/utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("Auth Module: auth.service", () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = {
      createUser: jest.fn(),
      findUsers: jest.fn(),
      getUser: jest.fn(),
      getUserByUserId: jest.fn(),
      updateUserInfo: jest.fn(),
      updateUserRoles: jest.fn(),
      updatePassword: jest.fn(),
      setResetCode: jest.fn(),
      increaseTokenVersion: jest.fn(),
      deleteUser: jest.fn(),
      createRole: jest.fn(),
      findRoles: jest.fn(),
      getRole: jest.fn(),
      updateRole: jest.fn(),
      deleteRole: jest.fn(),
    };
    service = createUserService(repository);
    jest.clearAllMocks();
  });

  const mockUser = {
    uid: "018e9b8f-1234-7abc-8def-0123456789ab",
    userId: "test.user",
    name: "test",
    org: "test",
    roles: ["USER_ROLE"],
    tokenVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRole = {
    key: "ROLE_KEY",
    name: "role",
    desc: "desc",
    perms: ["read"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const methods = [
    {
      name: "createUser",
      args: [{}],
      repo: "createUser",
      repoRes: mockUser,
      errCls: HttpBadRequest,
      errCode: "Cannot create new user",
    },
    {
      name: "findUsers",
      args: [{}],
      repo: "findUsers",
      repoRes: [mockUser],
      errCls: HttpNotFound,
      errCode: "Not Found Users",
      repoFailRes: [],
    },
    {
      name: "getUser",
      args: ["uid"],
      repo: "getUser",
      repoRes: mockUser,
      errCls: HttpNotFound,
      errCode: "Not Found User",
    },
    {
      name: "updatePassword",
      args: ["uid", "pw", "code"],
      repo: "updatePassword",
      repoRes: mockUser,
      errCls: HttpNotFound,
      errCode: "Not Found User",
    },
    {
      name: "requestResetCode",
      args: ["uid"],
      repo: "setResetCode",
      repoRes: true,
      errCls: HttpNotFound,
      errCode: "Not Found User",
    },
    {
      name: "deleteUser",
      args: ["uid"],
      repo: "deleteUser",
      repoRes: mockUser,
      errCls: HttpNotFound,
      errCode: "Not Found User",
    },
    {
      name: "createRole",
      args: [{}],
      repo: "createRole",
      repoRes: mockRole,
      errCls: HttpBadRequest,
      errCode: "Cannot create new role",
    },
    {
      name: "findRoles",
      args: [{}],
      repo: "findRoles",
      repoRes: [mockRole],
      errCls: HttpNotFound,
      errCode: "Not Found Roles",
      repoFailRes: [],
    },
    {
      name: "getRole",
      args: ["key"],
      repo: "getRole",
      repoRes: mockRole,
      errCls: HttpNotFound,
      errCode: "Not Found Role",
    },
    {
      name: "updateRole",
      args: ["key", {}],
      repo: "updateRole",
      repoRes: mockRole,
      errCls: HttpNotFound,
      errCode: "Not Found Role",
    },
    {
      name: "deleteRole",
      args: ["key"],
      repo: "deleteRole",
      repoRes: mockRole,
      errCls: HttpNotFound,
      errCode: "Not Found Role",
    },
  ];

  methods.forEach(({ name, args, repo, repoRes, errCls, repoFailRes = null }) => {
    describe(name, () => {
      test(`성공적으로 처리해야 합니다`, async () => {
        repository[repo].mockResolvedValue(repoRes);
        if (name === "createUser" || name === "updatePassword") bcrypt.hash.mockResolvedValue("hash");
        await service[name](...args);
        expect(repository[repo]).toHaveBeenCalled();
      });

      test(`리포지토리 결과가 없으면 에러를 던져야 합니다`, async () => {
        repository[repo].mockResolvedValue(repoFailRes);
        if (name === "createUser" || name === "updatePassword") bcrypt.hash.mockResolvedValue("hash");
        await expect(service[name](...args)).rejects.toThrow(errCls);
      });

      test(`DB 에러 시 HttpInternalServerError를 던져야 합니다`, async () => {
        repository[repo].mockRejectedValue(new Error("DB error"));
        if (name === "createUser" || name === "updatePassword") bcrypt.hash.mockResolvedValue("hash");
        await expect(service[name](...args)).rejects.toThrow(HttpInternalServerError);
      });

      test(`DB 에러에 stack이 없을 때도 HttpInternalServerError를 던져야 합니다`, async () => {
        const err = new Error("DB error no stack");
        delete err.stack;
        repository[repo].mockRejectedValue(err);
        if (name === "createUser" || name === "updatePassword") bcrypt.hash.mockResolvedValue("hash");
        await expect(service[name](...args)).rejects.toThrow(HttpInternalServerError);
      });
    });
  });

  describe("updateUserInfo", () => {
    test("성공", async () => {
      repository.updateUserInfo.mockResolvedValue(mockUser);
      repository.updateUserRoles.mockResolvedValue(mockUser);
      await service.updateUserInfo("uid", { roles: ["A"] });
      expect(repository.updateUserInfo).toHaveBeenCalled();
      expect(repository.updateUserRoles).toHaveBeenCalled();
    });
    test("유저 없음", async () => {
      repository.updateUserInfo.mockResolvedValue(null);
      await expect(service.updateUserInfo("uid", {})).rejects.toThrow(HttpNotFound);
    });
    test("에러", async () => {
      repository.updateUserInfo.mockRejectedValue(new Error("err"));
      await expect(service.updateUserInfo("uid", {})).rejects.toThrow(HttpInternalServerError);
    });
  });

  describe("findPermissions", () => {
    test("검색어가 없으면 모든 권한 반환", async () => {
      const res = await service.findPermissions();
      expect(res.length).toBeGreaterThan(0);
    });
    test("검색어가 있으면 필터링", async () => {
      const res = await service.findPermissions("read");
      expect(res.length).toBeGreaterThan(0);
    });
  });

  describe("login", () => {
    test("성공", async () => {
      repository.getUserByUserId.mockResolvedValue({ ...mockUser, password: "pw" });
      bcrypt.compare.mockResolvedValue(true);
      jwtUtils.generateToken.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
      repository.increaseTokenVersion.mockResolvedValue(true);
      const res = await service.login("test", "pw");
      expect(res.accessToken).toBe("a");
    });
    test("유저 없음", async () => {
      repository.getUserByUserId.mockResolvedValue(null);
      await expect(service.login("test", "pw")).rejects.toThrow(HttpUnauthorized);
    });
    test("비번 틀림", async () => {
      repository.getUserByUserId.mockResolvedValue({ ...mockUser, password: "pw" });
      bcrypt.compare.mockResolvedValue(false);
      await expect(service.login("test", "pw")).rejects.toThrow(HttpUnauthorized);
    });
    test("버전업 실패", async () => {
      repository.getUserByUserId.mockResolvedValue({ ...mockUser, password: "pw" });
      bcrypt.compare.mockResolvedValue(true);
      jwtUtils.generateToken.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
      repository.increaseTokenVersion.mockResolvedValue(false);
      await expect(service.login("test", "pw")).rejects.toThrow(HttpInternalServerError);
    });
    test("에러", async () => {
      repository.getUserByUserId.mockRejectedValue(new Error("err"));
      await expect(service.login("test", "pw")).rejects.toThrow(HttpInternalServerError);
    });
  });

  describe("refreshToken", () => {
    test("성공", async () => {
      jwtUtils.verifyRefreshToken.mockResolvedValue({ uid: "uid" });
      repository.getUser.mockResolvedValue(mockUser);
      jwtUtils.generateToken.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
      repository.increaseTokenVersion.mockResolvedValue(true);
      const res = await service.refreshToken("token");
      expect(res.accessToken).toBe("a");
    });
    test("유저 없음", async () => {
      jwtUtils.verifyRefreshToken.mockResolvedValue({ uid: "uid" });
      repository.getUser.mockResolvedValue(null);
      await expect(service.refreshToken("token")).rejects.toThrow(HttpUnauthorized);
    });
    test("버전업 실패", async () => {
      jwtUtils.verifyRefreshToken.mockResolvedValue({ uid: "uid" });
      repository.getUser.mockResolvedValue(mockUser);
      jwtUtils.generateToken.mockResolvedValue({ accessToken: "a", refreshToken: "r" });
      repository.increaseTokenVersion.mockResolvedValue(false);
      await expect(service.refreshToken("token")).rejects.toThrow(HttpInternalServerError);
    });
    test("에러", async () => {
      jwtUtils.verifyRefreshToken.mockRejectedValue(new Error("err"));
      await expect(service.refreshToken("token")).rejects.toThrow(HttpInternalServerError);
    });
  });

  describe("logoutAllDevice", () => {
    test("성공", async () => {
      repository.increaseTokenVersion.mockResolvedValue(true);
      await service.logoutAllDevice("uid");
      expect(repository.increaseTokenVersion).toHaveBeenCalled();
    });
    test("실패", async () => {
      repository.increaseTokenVersion.mockResolvedValue(false);
      await expect(service.logoutAllDevice("uid")).rejects.toThrow(HttpNotFound);
    });
    test("에러", async () => {
      repository.increaseTokenVersion.mockRejectedValue(new Error("err"));
      await expect(service.logoutAllDevice("uid")).rejects.toThrow(HttpInternalServerError);
    });
  });
});
