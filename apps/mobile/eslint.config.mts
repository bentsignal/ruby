import { defineConfig } from "eslint/config";

import { baseConfig, strictConfig } from "@acme/eslint-config/base";
import { reactConfig } from "@acme/eslint-config/react";
import { createStrictSyntax } from "@acme/eslint-config/syntax";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
  strictConfig,
  createStrictSyntax({ ts: true, react: true, mobile: true }),
);
