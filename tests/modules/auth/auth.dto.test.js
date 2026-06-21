const { createUserDTO, uidParams, updatePasswordDTO, loginDTO } = require("../../../src/modules/auth/auth.dto");
const { faker } = require("@faker-js/faker");

describe("Auth Module: auth.dto", () => {
  describe("createUserDTO", () => {
    /**
     * @description 유효한 사용자 생성 데이터가 DTO 검증을 통과하는지 테스트합니다.
     */
    test("유효한 데이터는 검증을 통과해야 합니다", () => {
      const validData = {
        userId: "valid.user-123",
        password: "Password123!@",
        name: faker.person.fullName(),
        org: faker.company.name(),
        roles: ["USER_ROLE"],
      };

      const result = createUserDTO.safeParse(validData);
      expect(result.success).toBe(true);
    });

    /**
     * @description 비밀번호 정책을 만족하지 않는 비밀번호가 거부되는지 테스트합니다.
     */
    test("비밀번호 정책을 위반한 경우 검증에 실패해야 합니다", () => {
      const invalidData = {
        userId: "valid.user",
        password: "password123", // 특수문자, 대문자 없음
        name: faker.person.fullName(),
        org: faker.company.name(),
        roles: ["USER_ROLE"],
      };

      const result = createUserDTO.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toContain("password");
    });
  });

  describe("uidParams", () => {
    /**
     * @description uuid v7 형식의 파라미터가 검증을 통과하는지 테스트합니다.
     */
    test("올바른 uuid 포맷의 uid는 검증을 통과해야 합니다", () => {
      // uuid v7 형식을 모방한 정규식에 맞는 문자열
      // regex: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
      const validUid = "018e9b8f-1234-7abc-8def-0123456789ab";
      const result = uidParams.safeParse({ uid: validUid });
      expect(result.success).toBe(true);
    });

    /**
     * @description 잘못된 형식의 파라미터가 거부되는지 테스트합니다.
     */
    test("잘못된 uid 포맷은 검증에 실패해야 합니다", () => {
      const invalidUid = "invalid-uid-string";
      const result = uidParams.safeParse({ uid: invalidUid });
      expect(result.success).toBe(false);
    });
  });

  describe("updatePasswordDTO", () => {
    /**
     * @description 비밀번호 변경 데이터가 올바를 때 통과하는지 테스트합니다.
     */
    test("유효한 비밀번호와 resetCode는 검증을 통과해야 합니다", () => {
      const validData = {
        password: "NewPassword1!@",
        resetCode: faker.string.alphanumeric(8),
      };

      const result = updatePasswordDTO.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("loginDTO", () => {
    /**
     * @description 로그인에 필요한 userId와 password가 주어지면 통과하는지 테스트합니다.
     */
    test("올바른 userId와 password는 통과해야 합니다", () => {
      const validData = {
        userId: "test.user",
        password: "Password123!@",
      };

      const result = loginDTO.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
