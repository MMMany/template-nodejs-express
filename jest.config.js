// jest.config.js

/**
 * @see https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
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
  moduleNameMapper: {
    "^#src/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!lodash-es/)"],
};

export default config;
