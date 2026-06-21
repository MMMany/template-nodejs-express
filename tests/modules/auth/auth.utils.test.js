const { generateSecureRandomString, getPermissions, PERMISSIONS } = require("../../../src/modules/auth/auth.utils");

describe("Auth Module: auth.utils", () => {
  describe("generateSecureRandomString", () => {
    /**
     * @description 요청한 길이만큼의 랜덤 문자열을 반환하는지 테스트합니다.
     */
    test("올바른 길이를 입력하면 해당 길이의 문자열을 반환해야 합니다", () => {
      const length = 10;
      const result = generateSecureRandomString(length);
      expect(typeof result).toBe("string");
      expect(result).toHaveLength(length);
    });

    /**
     * @description 양수가 아닌 길이를 입력했을 때 TypeError를 발생시키는지 테스트합니다.
     */
    test("길이가 양의 정수가 아니면 TypeError를 던져야 합니다", () => {
      expect(() => generateSecureRandomString(0)).toThrow(TypeError);
      expect(() => generateSecureRandomString(-5)).toThrow(TypeError);
      expect(() => generateSecureRandomString("10")).toThrow(TypeError);
    });
  });

  describe("getPermissions", () => {
    /**
     * @description 주어진 권한 목록 중 존재하는 권한만 필터링하여 Set으로 반환하는지 테스트합니다.
     */
    test("주어진 유효한 권한 목록을 중복 없이 Set 객체로 반환해야 합니다", () => {
      const validPerms = [PERMISSIONS.auth.read, PERMISSIONS.auth.write];
      const invalidPerms = ["invalid:perm", "fake:read"];

      const result = getPermissions(validPerms, invalidPerms);

      expect(result).toBeInstanceOf(Set);
      expect(result.has(PERMISSIONS.auth.read)).toBe(true);
      expect(result.has(PERMISSIONS.auth.write)).toBe(true);
      expect(result.has("invalid:perm")).toBe(false);
      expect(result.size).toBe(2);
    });

    /**
     * @description 중첩된 배열과 개별 문자열이 함께 들어와도 평탄화하여 처리하는지 테스트합니다.
     */
    test("중첩된 배열 구조의 파라미터도 평탄화하여 처리해야 합니다", () => {
      const result = getPermissions([PERMISSIONS.system.admin, PERMISSIONS.auth.read], PERMISSIONS.auth.write);

      expect(result.size).toBe(3);
      expect(result.has(PERMISSIONS.system.admin)).toBe(true);
      expect(result.has(PERMISSIONS.auth.write)).toBe(true);
    });
  });
});
