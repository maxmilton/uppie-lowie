import js from "@eslint/js";
import mm from "@maxmilton/eslint-config";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";
import ts from "typescript-eslint";

// eslint-disable-next-line unicorn/no-top-level-side-effects
export default defineConfig(
  js.configs.recommended,
  ts.configs.strictTypeChecked,
  ts.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  mm.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-misused-spread": "warn",
      "no-confusing-arrow": "warn",
      "unicorn/consistent-boolean-name": "off",
    },
  },
  includeIgnoreFile(new URL(".gitignore", import.meta.url).pathname, {
    gitignoreResolution: true,
  }),
);
