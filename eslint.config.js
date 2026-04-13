import globals from "globals";
import js from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import pluginJsdoc from "eslint-plugin-jsdoc";
import configPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  pluginJsdoc.configs["flat/recommended"],
  {
    // 전역 JS 설정
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest", // 🌟 개선됨: 2022 대신 항상 최신 문법(Top-level await 등)을 지원하도록 변경
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
        // worker는 백엔드에서 worker_threads를 직접 쓰지 않는다면 생략해도 무방합니다.
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
    // Jest 테스트 파일 설정
    // 🌟 핵심 개선됨: src 폴더 내부의 테스트 파일도 Jest 환경으로 인식하도록 배열 확장
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
      ...pluginJest.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
  // 🌟 중요: Prettier 설정은 무조건 배열의 맨 '마지막'에 위치해야 합니다.
  configPrettier,
];
