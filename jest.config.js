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
  // setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^#/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = config;
