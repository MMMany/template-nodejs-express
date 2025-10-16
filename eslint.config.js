// const { globalIgnores } = require("eslint/config");
const globals = require("globals");
const js = require("@eslint/js");
const configPrettier = require("eslint-config-prettier");
const pluginJest = require("eslint-plugin-jest");

module.exports = [
  js.configs.recommended,
  configPrettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.worker },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-console": "off",
    },
  },
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
];
