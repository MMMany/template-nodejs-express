const { validateAuth } = require("../../src/middlewares/auth.middleware");
const { verifyAccessToken } = require("../../src/utils/jwt");
const { PERMISSIONS } = require("../../src/modules/auth/auth.utils");
const { faker } = require("@faker-js/faker");

jest.mock("../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));
jest.mock("../../src/utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("Middlewares: auth.middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  /**
   * @description Authorization 헤더가 없거나 잘못된 형식일 때 401 에러를 반환하는지 테스트합니다.
   */
  test("Authorization 헤더가 없거나 Bearer로 시작하지 않으면 401을 반환해야 합니다", async () => {
    const middleware = validateAuth();
    req.headers.authorization = "InvalidTokenFormat";

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * @description 유효한 토큰이며, 권한 검사가 필요 없는 경우 req.user에 데이터를 담고 next()를 호출하는지 테스트합니다.
   */
  test("권한 제한이 없고 유효한 토큰이면 req.user를 설정하고 next()를 호출해야 합니다", async () => {
    const middleware = validateAuth();
    req.headers.authorization = "Bearer validToken123";

    const mockPayload = {
      uid: faker.string.uuid(),
      userId: faker.internet.username(),
      perms: ["some:perm"],
      tokenVersion: 1,
    };
    verifyAccessToken.mockResolvedValue(mockPayload);

    await middleware(req, res, next);

    expect(verifyAccessToken).toHaveBeenCalledWith("validToken123");
    expect(req.user).toEqual({
      ...mockPayload,
      isAdmin: false,
    });
    expect(next).toHaveBeenCalled();
  });

  /**
   * @description 시스템 관리자 권한을 가진 유저가 제한된 라우트에 접근할 때 통과되는지 테스트합니다.
   */
  test("요청한 유저가 시스템 관리자(admin) 권한이 있으면 무조건 next()를 호출해야 합니다", async () => {
    const middleware = validateAuth(PERMISSIONS.auth.write);
    req.headers.authorization = "Bearer adminToken";

    const mockPayload = {
      uid: faker.string.uuid(),
      userId: "admin",
      perms: [PERMISSIONS.system.admin],
      tokenVersion: 1,
    };
    verifyAccessToken.mockResolvedValue(mockPayload);

    await middleware(req, res, next);

    expect(req.user.isAdmin).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  /**
   * @description 일반 유저가 요구되는 권한을 가지고 있지 않을 때 403 Forbidden 에러를 반환하는지 테스트합니다.
   */
  test("요구되는 권한이 없고 관리자도 아니면 403 상태 코드를 반환해야 합니다", async () => {
    const middleware = validateAuth(PERMISSIONS.auth.write);
    req.headers.authorization = "Bearer normalToken";

    const mockPayload = {
      uid: faker.string.uuid(),
      userId: "user",
      perms: [PERMISSIONS.auth.read], // 쓰기 권한이 없음
      tokenVersion: 1,
    };
    verifyAccessToken.mockResolvedValue(mockPayload);

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * @description 일반 유저가 요구되는 권한을 가지고 있을 때 통과되는지 테스트합니다.
   */
  test("요구되는 권한을 가지고 있으면 next()를 호출해야 합니다", async () => {
    const middleware = validateAuth(PERMISSIONS.auth.read);
    req.headers.authorization = "Bearer normalToken2";

    const mockPayload = {
      uid: faker.string.uuid(),
      userId: "user2",
      perms: [PERMISSIONS.auth.read],
      tokenVersion: 1,
    };
    verifyAccessToken.mockResolvedValue(mockPayload);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.perms).toContain(PERMISSIONS.auth.read);
  });

  /**
   * @description verifyAccessToken에서 예상치 못한 에러가 발생했을 때 500 에러를 반환하는지 테스트합니다.
   */
  test("알 수 없는 에러가 발생하면 500 상태 코드를 반환해야 합니다", async () => {
    const middleware = validateAuth();
    req.headers.authorization = "Bearer errorToken";

    verifyAccessToken.mockRejectedValue(new Error("Unknown Token Error"));

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});
