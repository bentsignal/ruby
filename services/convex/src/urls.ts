import { createUrls } from "@acme/app-config/urls";

import { env } from "./convex.env";

export const urls = createUrls({
  nodeEnv: env.ENVIRONMENT === "production" ? "production" : "development",
});
