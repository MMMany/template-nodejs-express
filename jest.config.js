/**
 * @see https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: "node",

  // 🌟 개선됨: 기존 tests 폴더뿐만 아니라, src 내부의 colocation된 테스트 파일도 찾도록 배열 확장
  testMatch: ["<rootDir>/src/**/*.test.js", "<rootDir>/tests/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  testTimeout: 20000,
  verbose: true,
  setupFiles: ["<rootDir>/tests/setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 🌟 핵심: tsconfig.json 및 package.json의 매핑과 100% 동일하게 구성
  moduleNameMapper: {
    // 1. 단일 파일 명시적 매핑 (와일드카드보다 무조건 위에 있어야 합니다!)
    "^#app$": "<rootDir>/src/main.js",
    "^db/setup$": "<rootDir>/src/db/setup.js",
    "^db/mongoose$": "<rootDir>/src/db/mongoose.js",
    "^#shared/constants$": "<rootDir>/src/shared/constants.js",

    // 2. 폴더 캡슐화 (index.js 자동 매핑)
    "^#modules/(.*)$": "<rootDir>/src/modules/$1/index.js",
    "^#shared/(.*)$": "<rootDir>/src/shared/$1/index.js",
  },

  // transformIgnorePatterns: ["/node_modules/(?!lodash-es/)"],
};

export default config;
