import { createUrls } from "@acme/config/urls";

import { env } from "~/env";

export const urls = createUrls({
  nodeEnv: env.VITE_NODE_ENV,
});
