const createUserController = require("../../../src/modules/auth/auth.controller");
const { formatSuccess } = require("../../../src/utils/response-format");
const { HttpUnauthorized } = require("../../../src/utils/http-errors");

jest.mock("../../../src/utils/response-format", () => ({
  formatSuccess: jest.fn((msg, data) => ({ status: "success", message: msg, data })),
  formatFail: jest.fn((msg) => ({ status: "fail", message: msg })),
  formatError: jest.fn((msg) => ({ status: "error", message: msg })),
}));

describe("Auth Module: auth.controller", () => {
  let service;
  let controller;
  let req, res;

  beforeEach(() => {
    service = {
      createUser: jest.fn(),
      findUsers: jest.fn(),
      getUser: jest.fn(),
      updateUserInfo: jest.fn(),
      updatePassword: jest.fn(),
      requestResetCode: jest.fn(),
      deleteUser: jest.fn(),
      createRole: jest.fn(),
      findRoles: jest.fn(),
      getRole: jest.fn(),
      updateRole: jest.fn(),
      deleteRole: jest.fn(),
      findPermissions: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      logoutAllDevice: jest.fn(),
    };
    controller = createUserController(service);

    req = {
      body: {},
      params: {},
      query: {},
      valid: {},
      user: {},
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    process.env.AUTH_REFRESH_COOKIE_NAME = "refreshToken";
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: "createUser",
      method: "post",
      call: () => controller.createUser(req, res),
      successCode: 201,
      serviceMethod: "createUser",
      msg: "Create new user success",
    },
    {
      name: "findUsers",
      method: "get",
      call: () => controller.findUsers(req, res),
      successCode: 200,
      serviceMethod: "findUsers",
      msg: "Find users success",
    },
    {
      name: "updatePassword",
      method: "patch",
      call: () => controller.updatePassword(req, res),
      successCode: 200,
      serviceMethod: "updatePassword",
      msg: "Update user password success",
    },
    {
      name: "requestResetCode",
      method: "post",
      call: () => controller.requestResetCode(req, res),
      successCode: 200,
      serviceMethod: "requestResetCode",
      msg: "Request reset code success",
    },
    {
      name: "deleteUser",
      method: "delete",
      call: () => controller.deleteUser(req, res),
      successCode: 200,
      serviceMethod: "deleteUser",
      msg: "Delete user success",
    },
    {
      name: "createRole",
      method: "post",
      call: () => controller.createRole(req, res),
      successCode: 201,
      serviceMethod: "createRole",
      msg: "Create new role success",
    },
    {
      name: "findRoles",
      method: "get",
      call: () => controller.findRoles(req, res),
      successCode: 200,
      serviceMethod: "findRoles",
      msg: "Find roles success",
    },
    {
      name: "getRole",
      method: "get",
      call: () => controller.getRole(req, res),
      successCode: 200,
      serviceMethod: "getRole",
      msg: "Get role success",
    },
    {
      name: "updateRole",
      method: "patch",
      call: () => controller.updateRole(req, res),
      successCode: 200,
      serviceMethod: "updateRole",
      msg: "Update role success",
    },
    {
      name: "deleteRole",
      method: "delete",
      call: () => controller.deleteRole(req, res),
      successCode: 200,
      serviceMethod: "deleteRole",
      msg: "Delete role success",
    },
    {
      name: "findPermissions",
      method: "get",
      call: () => controller.findPermissions(req, res),
      successCode: 200,
      serviceMethod: "findPermissions",
      msg: "Find permissions success",
    },
  ];

  testCases.forEach(({ name, call, successCode, serviceMethod, msg }) => {
    describe(name, () => {
      test(`성공 시 ${successCode} 상태 코드와 성공 응답을 반환해야 합니다`, async () => {
        service[serviceMethod].mockResolvedValue({});
        await call();
        expect(res.status).toHaveBeenCalledWith(successCode);
        expect(formatSuccess).toHaveBeenCalledWith(msg, expect.any(Object));
      });

      test(`에러 발생 시 500 상태 코드와 에러 응답을 반환해야 합니다`, async () => {
        service[serviceMethod].mockRejectedValue(new Error("unexpected"));
        await call();
        expect(res.status).toHaveBeenCalledWith(500);
      });

      test(`HttpError 발생 시 해당 상태 코드와 실패 응답을 반환해야 합니다`, async () => {
        service[serviceMethod].mockRejectedValue(new HttpUnauthorized("error"));
        await call();
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });

  describe("getUser", () => {
    test("자신의 정보 조회 시 200 상태 코드와 성공 응답을 반환해야 합니다", async () => {
      req.params.uid = "user-uid";
      req.user = { uid: "user-uid", isAdmin: false, perms: [] };
      service.getUser.mockResolvedValue({});
      await controller.getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("다른 사용자 정보 조회 시 권한이 없으면 403 Forbidden 응답을 반환해야 합니다", async () => {
      req.params.uid = "other-uid";
      req.user = { uid: "user-uid", isAdmin: false, perms: [] };
      await controller.getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("updateUserInfo", () => {
    test("자신의 정보 수정 시 200 상태 코드를 반환해야 합니다", async () => {
      req.params.uid = "user-uid";
      req.user = { uid: "user-uid", isAdmin: false, perms: [] };
      service.updateUserInfo.mockResolvedValue({});
      await controller.updateUserInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("다른 사용자 정보 수정 시 권한이 없으면 403 Forbidden 응답을 반환해야 합니다", async () => {
      req.params.uid = "other-uid";
      req.user = { uid: "user-uid", isAdmin: false, perms: [] };
      await controller.updateUserInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("login", () => {
    test("로그인 성공 시 리프레시 토큰을 쿠키에 설정하고 성공 응답을 반환해야 합니다", async () => {
      req.body = { userId: "test", password: "password" };
      service.login.mockResolvedValue({ accessToken: "access", refreshToken: "refresh", user: {} });
      await controller.login(req, res);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("logout", () => {
    test("쿠키를 지우고 성공 응답을 반환해야 합니다", async () => {
      await controller.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("refreshToken", () => {
    test("리프레시 토큰 성공 시 새 쿠키를 설정하고 응답을 반환해야 합니다", async () => {
      req.cookies.refreshToken = "old-refresh";
      service.refreshToken.mockResolvedValue({ accessToken: "access", refreshToken: "new-refresh", user: {} });
      await controller.refreshToken(req, res);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("에러 발생 시 500 응답을 반환해야 합니다", async () => {
      service.refreshToken.mockRejectedValue(new Error("unexpected"));
      await controller.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("logoutAllDevice", () => {
    test("쿠키를 지우고 모든 디바이스 로그아웃 성공 응답을 반환해야 합니다", async () => {
      req.user = { uid: "123" };
      service.logoutAllDevice.mockResolvedValue();
      await controller.logoutAllDevice(req, res);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("유저 정보가 없을 때 HttpUnauthorized 에러 응답을 반환해야 합니다", async () => {
      req.user = undefined;
      await controller.logoutAllDevice(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
