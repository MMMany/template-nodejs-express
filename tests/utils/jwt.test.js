process.env.AUTH_ACCESS_TOKEN_SECRET_PATH = "/path/to/secret";
process.env.AUTH_REFRESH_TOKEN_SECRET_PATH = "/path/to/refresh-secret";

const jwt = require("jsonwebtoken");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { generateToken, verifyAccessToken, verifyRefreshToken } = require("../../src/utils/jwt");
const { HttpInternalServerError, HttpUnauthorized } = require("../../src/utils/http-errors");
const logger = require("../../src/utils/logger");

jest.mock("jsonwebtoken");
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
jest.mock("../../src/utils/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("Utils: jwt", () => {
  const mockSecret = "super-secret-key";
  const mockPayload = {
    uid: faker.string.uuid(),
    userId: faker.internet.username(),
    perms: ["auth:read"],
    tokenVersion: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AUTH_ACCESS_TOKEN_SECRET_PATH = "/path/to/secret";
    fs.promises.readFile.mockResolvedValue(mockSecret);
  });

  describe("generateToken", () => {
    /**
     * @description generateToken 함수가 올바른 페이로드와 시크릿으로 accessToken과 refreshToken을 생성하는지 테스트합니다.
     */
    test("올바른 payload를 받아 accessToken과 refreshToken을 반환해야 합니다", async () => {
      jwt.sign.mockImplementation((payload, secret, options) => {
        if (options.expiresIn === "1h") return "mockAccessToken";
        if (options.expiresIn === "1d") return "mockRefreshToken";
      });

      const tokens = await generateToken(mockPayload);

      expect(fs.promises.readFile).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });
    });

    /**
     * @description 시크릿 파일을 읽어오는데 실패했을 때 내부 서버 에러를 발생시키는지 테스트합니다.
     */
    test("시크릿을 가져오는데 실패하면 HttpInternalServerError를 던져야 합니다", async () => {
      fs.promises.readFile.mockRejectedValue(new Error("File not found"));

      await expect(generateToken(mockPayload)).rejects.toThrow(HttpInternalServerError);
      expect(logger.error).toHaveBeenCalled();
    });

    test("리프레시 시크릿을 가져오는데 실패해도 HttpInternalServerError를 던져야 합니다", async () => {
      fs.promises.readFile
        .mockResolvedValueOnce(mockSecret) // getAccessSecret 성공
        .mockRejectedValueOnce(new Error("File not found")); // getRefreshSecret 실패

      await expect(generateToken(mockPayload)).rejects.toThrow(HttpInternalServerError);
      expect(logger.error).toHaveBeenCalled();
    });

    /**
     * @description jwt.sign 중 에러가 발생하면 내부 서버 에러를 발생시키는지 테스트합니다.
     */
    test("토큰 생성 중 jwt 에러가 발생하면 HttpInternalServerError를 던져야 합니다", async () => {
      jwt.sign.mockImplementation(() => {
        throw new Error("jwt sign error");
      });

      await expect(generateToken(mockPayload)).rejects.toThrow(HttpInternalServerError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("verifyAccessToken", () => {
    /**
     * @description 올바른 엑세스 토큰이 주어졌을 때 디코딩된 페이로드를 반환하는지 테스트합니다.
     */
    test("유효한 accessToken을 검증하고 디코딩된 payload를 반환해야 합니다", async () => {
      jwt.verify.mockReturnValue(mockPayload);

      const decoded = await verifyAccessToken("validToken");

      expect(jwt.verify).toHaveBeenCalledWith("validToken", mockSecret);
      expect(decoded).toEqual(mockPayload);
    });

    /**
     * @description 만료된 토큰이 주어졌을 때 TokenExpiredError를 처리하여 HttpUnauthorized를 던지는지 테스트합니다.
     */
    test("만료된 토큰인 경우 HttpUnauthorized(token-expired)를 던져야 합니다", async () => {
      const expiredError = new Error("jwt expired");
      expiredError.name = "TokenExpiredError";
      jwt.verify.mockImplementation(() => {
        throw expiredError;
      });

      await expect(verifyAccessToken("expiredToken")).rejects.toThrow(HttpUnauthorized);
      await expect(verifyAccessToken("expiredToken")).rejects.toMatchObject({ message: "token-expired" });
    });

    /**
     * @description 잘못된 토큰이 주어졌을 때 JsonWebTokenError를 처리하여 HttpUnauthorized를 던지는지 테스트합니다.
     */
    test("잘못된 토큰인 경우 HttpUnauthorized(token-invalid)를 던져야 합니다", async () => {
      const invalidError = new Error("invalid token");
      invalidError.name = "JsonWebTokenError";
      jwt.verify.mockImplementation(() => {
        throw invalidError;
      });

      await expect(verifyAccessToken("invalidToken")).rejects.toThrow(HttpUnauthorized);
      await expect(verifyAccessToken("invalidToken")).rejects.toMatchObject({ message: "token-invalid" });
    });
  });

  describe("verifyRefreshToken", () => {
    /**
     * @description 올바른 리프레시 토큰이 주어졌을 때 디코딩된 페이로드를 반환하는지 테스트합니다.
     */
    test("유효한 refreshToken을 검증하고 디코딩된 payload를 반환해야 합니다", async () => {
      jwt.verify.mockReturnValue(mockPayload);

      const decoded = await verifyRefreshToken("validToken");

      expect(jwt.verify).toHaveBeenCalledWith("validToken", mockSecret);
      expect(decoded).toEqual(mockPayload);
    });

    /**
     * @description 알 수 없는 에러가 발생했을 때 HttpInternalServerError를 던지는지 테스트합니다.
     */
    test("리프레시 시크릿을 가져오는데 실패하면 HttpInternalServerError를 던져야 합니다", async () => {
      fs.promises.readFile.mockRejectedValue(new Error("File not found"));

      await expect(verifyRefreshToken("validToken")).rejects.toThrow(HttpInternalServerError);
    });

    test("알 수 없는 에러 발생 시 HttpInternalServerError를 던져야 합니다", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Unknown error");
      });

      await expect(verifyRefreshToken("errorToken")).rejects.toThrow(HttpInternalServerError);
    });
  });
});
