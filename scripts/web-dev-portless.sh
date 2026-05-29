#!/bin/sh
set -eu

PORTLESS_NAME="www.ruby"
OVERRIDES_FILE="$(dirname "$0")/../packages/app-config/src/overrides.ts"
WORKTREE_ID=""

if [ -f "$OVERRIDES_FILE" ]; then
  WORKTREE_ID="$(sed -n 's/^export const worktreeId: string | undefined = "\(.*\)";$/\1/p' "$OVERRIDES_FILE" | head -n 1)"
fi

if [ "$WORKTREE_ID" != "" ]; then
  PORTLESS_NAME="${WORKTREE_ID}.${PORTLESS_NAME}"
fi

exec portless run --name "$PORTLESS_NAME"
