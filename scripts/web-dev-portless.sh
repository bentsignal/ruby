#!/bin/sh
set -eu

PORTLESS_NAME="www.ruby"

if [ "${VITE_WORKTREE_ID:-}" != "" ]; then
  PORTLESS_NAME="${VITE_WORKTREE_ID}.${PORTLESS_NAME}"
fi

exec portless run --name "$PORTLESS_NAME"
