// src/config.js

import fs from "fs-extra";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

const requiredEnv = ["PORT"];

/* istanbul ignore next */
export function dotenvSetup() {
  if (!process.env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
  }

  const NODE_ENV = process.env.NODE_ENV;

  const dotenvFiles = [
    ".env",
    NODE_ENV !== "test" && ".env.local",
    `.env.${NODE_ENV}`,
    `.env.${NODE_ENV}.local`,
  ].filter(fs.existsSync);

  dotenvFiles.forEach((file) => {
    expand(
      config({
        path: file,
        override: true,
        debug: NODE_ENV === "development",
        quiet: NODE_ENV !== "development",
        encoding: "utf8",
      }),
    );
  });

  const required = requiredEnv.reduce((acc, it) => {
    acc[it] = process.env[it];
    return acc;
  }, {});
  const hasAllRequired = Object.values(required).every(Boolean);

  if (!hasAllRequired) {
    const missing = Object.entries(required).reduce((acc, [key, value]) => {
      if (value === undefined) {
        acc.push(key);
      }
      return acc;
    }, []);
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
