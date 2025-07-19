// tests/sample.test.js

import { jest } from "@jest/globals";

describe("Unit Test", () => {
  afterAll(async () => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    jest.resetModules();
  });

  describe("src/setup.js", () => {
    it("should connect and close all DBs", async () => {
      const { connectAllDb, closeAllDb } = await import("../src/db/setup.js");
      await connectAllDb();
      await closeAllDb();
    });
  });
});
