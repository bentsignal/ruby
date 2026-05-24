#!/bin/sh
set -eu

NEW_WT="$PWD"

BRANCH_NAME="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
HEAD_SHA="$(git rev-parse --short HEAD)"
PORTLESS_WORKTREE_ID="$("$NEW_WT/scripts/worktree-id.sh")"
WT_NAME="$(printf '%s\n' "${BRANCH_NAME:-worktree-$PORTLESS_WORKTREE_ID}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/^-*//;s/-*$//')"

if [ -z "$WT_NAME" ]; then
  WT_NAME="worktree-$PORTLESS_WORKTREE_ID"
fi

echo "branch=${BRANCH_NAME:-HEAD}"
echo "head=$HEAD_SHA"
echo "worktree_id=$PORTLESS_WORKTREE_ID"
echo "web_url=https://$PORTLESS_WORKTREE_ID.www.ruby.localhost"

touch .env
if grep -q '^VITE_WORKTREE_ID=' .env; then
  sed -i '' "s|^VITE_WORKTREE_ID=.*|VITE_WORKTREE_ID=$PORTLESS_WORKTREE_ID|" .env
else
  printf '\nVITE_WORKTREE_ID=%s\n' "$PORTLESS_WORKTREE_ID" >> .env
fi
echo "updated VITE_WORKTREE_ID to $PORTLESS_WORKTREE_ID"

cd "$NEW_WT/packages/convex"

# Pull env vars from the main deployment before switching
TEMP_ENV=$(mktemp)
npx convex env list > "$TEMP_ENV"

npx convex deployment create "dev/$WT_NAME" --select --expiration "in 7 days" --type dev < /dev/null
npx convex deployment token create "$WT_NAME" --save-env < /dev/null

# Push env vars to the new deployment
if [ -s "$TEMP_ENV" ]; then
  npx convex env set --from-file "$TEMP_ENV" < /dev/null
  echo "copied environment variables to new deployment"
fi
rm -f "$TEMP_ENV"

npx convex dev --once --tail-logs disable < /dev/null
echo "pushed Convex functions to worktree deployment"

cd "$NEW_WT"

# Generate the app-config overrides with worktree-specific values
NEW_CONVEX_URL="$(grep '^CONVEX_URL=' packages/convex/.env.local | cut -d= -f2-)"

cat > packages/app-config/src/overrides.ts <<EOF
export const convexCloudUrl: string | undefined = "${NEW_CONVEX_URL}";
export const worktreeId: string | undefined = "${PORTLESS_WORKTREE_ID}";
EOF
echo "generated overrides.ts (convexCloudUrl=${NEW_CONVEX_URL}, worktreeId=${PORTLESS_WORKTREE_ID})"

cd "$NEW_WT"
