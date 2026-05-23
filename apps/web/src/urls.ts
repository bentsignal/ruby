import { createUrls } from "@acme/app-config/urls";

import { env } from "~/env";

export const urls = createUrls({
  nodeEnv: env.VITE_NODE_ENV,
  worktreeId: env.VITE_WORKTREE_ID,
});
