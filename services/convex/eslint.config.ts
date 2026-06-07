import convexPlugin from "@convex-dev/eslint-plugin";
import { defineConfig } from "eslint/config";

import { baseConfig, strictConfig } from "@acme/eslint-config/base";
import { convexConfig } from "@acme/eslint-config/convex";
import { createStrictSyntax } from "@acme/eslint-config/syntax";

export default defineConfig(
  {
    ignores: ["src/_generated/**"],
  },
  baseConfig,
  strictConfig,
  convexConfig,
  createStrictSyntax({ ts: true }),
  ...convexPlugin.configs.recommended,
);
