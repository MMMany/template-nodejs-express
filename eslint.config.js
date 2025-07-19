// eslint.config.js

import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
  {
    ignores: ["node_modules/"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "off",
    },
  },
  configPrettier,
  {
    files: ["tests/**/*.js"],
    plugins: { jest: pluginJest },
    languageOptions: { globals: pluginJest.environments.globals.globals },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
]);
