const fs = require("node:fs");
const { config } = require("dotenv");
const { expand } = require("dotenv-expand");

const requiredEnv = ["PORT"];

/* istanbul ignore next */
/**
 * setup environments using `dotenv` & `dotenv-expand`
 */
function dotenvSetup() {
  if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
  }

  const NODE_ENV = process.env.NODE_ENV;

  const dotenvFiles = [".env", ".env.local", `.env.${NODE_ENV}`, `.env.${NODE_ENV}.local`].filter((it) =>
    fs.existsSync(it),
  );

  /** @type {import('dotenv').DotenvConfigOutput} */
  const configOutput = dotenvFiles.reduce((acc, file) => {
    return config({
      path: file,
      override: true,
      debug: NODE_ENV === "development",
      quiet: NODE_ENV !== "development",
      encoding: "utf8",
    });
  }, {});

  expand({ parsed: configOutput.parsed });

  const required = requiredEnv.reduce((acc, it) => {
    return {
      ...acc,
      [it]: process.env[it],
    };
  }, {});
  const hasAllRequired = Object.values(required).every(Boolean);

  if (!hasAllRequired) {
    const missing = Object.entries(required)
      .filter(([_, value]) => value === undefined)
      .map(([key]) => key);
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

dotenvSetup();
