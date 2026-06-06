import { worktreeId as overrideWorktreeId } from "./overrides";
import { normalizeWorktreeId } from "./worktrees";

const WORKTREE_STORAGE_ROOT = "work-trees";

interface StorageKeyPrefixOptions {
  worktreeId?: string;
}

export function createStorageKeyPrefix(options: StorageKeyPrefixOptions = {}) {
  const worktreeId = normalizeWorktreeId(
    options.worktreeId ?? overrideWorktreeId,
  );

  if (!worktreeId) {
    return undefined;
  }

  return [WORKTREE_STORAGE_ROOT, worktreeId].join("/");
}
