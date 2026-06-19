import { worktreeId as overrideWorktreeId } from "./overrides";
import { normalizeWorktreeId } from "./worktrees";

const POST_STORAGE_ROOT = "posts";

interface StorageKeyPrefixOptions {
  environment?: "development" | "preview" | "production" | "test";
  worktreeId?: string;
}

export function createStorageKeyPrefix(options: StorageKeyPrefixOptions = {}) {
  const worktreeId = normalizeWorktreeId(
    options.worktreeId ?? overrideWorktreeId,
  );

  if (options.environment === "production") {
    return [POST_STORAGE_ROOT, "prod"].join("/");
  }

  if (worktreeId) {
    return [POST_STORAGE_ROOT, "dev", "worktrees", worktreeId].join("/");
  }

  return [POST_STORAGE_ROOT, "dev"].join("/");
}
