import globals from "globals";
import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  configPrettier,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node, ...globals.worker, ...globals.es2021 },
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
    },
  },
  // {
  //   files: ["src/**/*.js"],
  //   languageOptions: {
  //     ecmaVersion: 2022,
  //     sourceType: "commonjs",
  //     globals: { ...globals.node, ...globals.worker },
  //   },
  //   rules: {
  //     "no-unused-vars": [
  //       "error",
  //       {
  //         varsIgnorePattern: "^_",
  //         argsIgnorePattern: "^_",
  //         caughtErrorsIgnorePattern: "^_",
  //       },
  //     ],
  //     "no-console": "off",
  //   },
  // },
  {
    files: ["tests/**/*.js"],
    plugins: {
      jest: pluginJest,
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
        ...pluginJest.environments.globals.globals,
      },
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
