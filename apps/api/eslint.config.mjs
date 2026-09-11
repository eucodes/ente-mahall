// @ts-check
import tseslint from "typescript-eslint";
import base from "@mahalle/config/eslint-base";

export default tseslint.config(
  { ignores: ["dist/**"] },
  ...tseslint.configs.recommended,
  ...base
);
