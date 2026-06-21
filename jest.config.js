// jest.config.js

/**
 * @see https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: "node",
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
  moduleNameMapper: {
    "^#/(.*)$": "<rootDir>/src/$1",
    "^#modules/(.*)$": "<rootDir>/src/modules/$1",
    "^#shared/(.*)$": "<rootDir>/src/shared/$1",
  },
};

module.exports = config;
