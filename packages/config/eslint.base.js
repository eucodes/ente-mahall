// @ts-check
const tseslint = require("typescript-eslint");

/** Shared base rules for all TypeScript packages in the monorepo. */
module.exports = tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
});
