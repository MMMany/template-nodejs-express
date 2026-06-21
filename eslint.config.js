const globals = require("globals");
const js = require("@eslint/js");
const configPrettier = require("eslint-config-prettier");
const pluginJest = require("eslint-plugin-jest");
const pluginJsdoc = require("eslint-plugin-jsdoc");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  pluginJsdoc.configs["flat/recommended"],
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "jsdoc/require-description": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
      "jsdoc/reject-any-type": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/require-property-description": "off",
    },
  },
  {
    files: ["tests/**/*.js", "src/**/*.test.js"],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
  configPrettier,
];
