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
  transform: {}, // for ESM
  setupFiles: ["./tests/setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default config;
