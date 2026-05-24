#!/bin/sh
set -eu

branch="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"

if [ -n "$branch" ] && [ "$branch" != "main" ] && [ "$branch" != "master" ]; then
  raw_id="${branch##*/}"
else
  raw_id="$(git rev-parse --short HEAD)"
fi

worktree_id="$(printf '%s\n' "$raw_id" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9-]/-/g' \
  | sed 's/^-*//;s/-*$//' \
  | sed -E 's/^.*-([a-f0-9]{7,12})$/\1/')"

if [ -z "$worktree_id" ]; then
  printf 'Could not derive worktree id from branch "%s" or git HEAD.\n' "$branch" >&2
  exit 1
fi

printf '%s\n' "$worktree_id"
