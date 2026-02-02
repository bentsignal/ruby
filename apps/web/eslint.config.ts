import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@acme/eslint-config/base";
import { reactConfig } from "@acme/eslint-config/react";

export default defineConfig(
  {
    ignores: [".vinxi/**", "dist/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
  {
    rules: {
      "@typescript-eslint/only-throw-error": "off",
    },
  },
);
