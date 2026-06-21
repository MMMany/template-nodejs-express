const { formatSuccess, formatFail, formatError } = require("../../src/utils/response-format");
const { faker } = require("@faker-js/faker");

describe("Utils: response-format", () => {
  /**
   * @description formatSuccess 유틸리티 함수가 'success' 상태의 응답 객체를 올바르게 생성하는지 테스트합니다.
   */
  test("formatSuccess가 올바른 성공 응답 포맷을 반환해야 합니다", () => {
    const message = faker.lorem.sentence();
    const data = { id: faker.string.uuid() };

    const result = formatSuccess(message, data);

    expect(result).toEqual({
      status: "success",
      message,
      data,
    });
  });

  /**
   * @description formatFail 유틸리티 함수가 'fail' 상태의 응답 객체를 올바르게 생성하는지 테스트합니다.
   */
  test("formatFail이 올바른 실패 응답 포맷을 반환해야 합니다", () => {
    const message = faker.lorem.sentence();
    const data = { errorField: "email" };

    const result = formatFail(message, data);

    expect(result).toEqual({
      status: "fail",
      message,
      data,
    });
  });

  /**
   * @description formatError 유틸리티 함수가 'error' 상태의 응답 객체를 올바르게 생성하는지 테스트합니다.
   */
  test("formatError가 올바른 에러 응답 포맷을 반환해야 합니다", () => {
    const message = faker.lorem.sentence();
    const data = { code: 500 };

    const result = formatError(message, data);

    expect(result).toEqual({
      status: "error",
      message,
      data,
    });
  });
});
