import {
  convexCloudUrl as overrideConvexCloudUrl,
  worktreeId as overrideWorktreeId,
} from "./overrides";
import { normalizeWorktreeId } from "./worktrees";

const CONVEX = {
  production: {
    cloud: "https://api.ruby.travel",
    site: "https://site.ruby.travel",
  },
  development: {
    cloud: "https://api.dev.ruby.travel",
    site: "https://site.dev.ruby.travel",
  },
} as const;

interface UrlOptions {
  nodeEnv?: "development" | "production" | "test";
  worktreeId?: string;
}

function webUrl(options: UrlOptions & { effectiveWorktreeId?: string }) {
  if (options.nodeEnv === "production") {
    return "https://www.ruby.travel";
  }
  const prefix = normalizeWorktreeId(options.effectiveWorktreeId);
  const host = [prefix, "www.ruby", "local"].filter(Boolean).join(".");
  return `https://${host}`;
}

export function createUrls(options: UrlOptions = {}) {
  const tier = options.nodeEnv === "production" ? "production" : "development";
  const effectiveWorktreeId = options.worktreeId ?? overrideWorktreeId;
  const effectiveConvexCloudUrl =
    tier === "production"
      ? CONVEX.production.cloud
      : (overrideConvexCloudUrl ?? CONVEX.development.cloud);

  return {
    web: webUrl({ ...options, effectiveWorktreeId }),
    convex: {
      cloud: effectiveConvexCloudUrl,
      site: CONVEX[tier].site,
    },
  } as const;
}
