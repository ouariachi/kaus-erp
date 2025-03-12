import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  js.configs.recommended,
  prettierConfig,
  {
    ignores: ["node_modules", "dist", "build"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": "warn",
    },
  },
];
