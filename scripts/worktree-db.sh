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

set_env_var() {
  FILE="$1"
  NAME="$2"
  VALUE="$3"

  touch "$FILE"
  if grep -q "^$NAME=" "$FILE"; then
    sed -i '' "s|^$NAME=.*|$NAME=$VALUE|" "$FILE"
  else
    printf '\n%s=%s\n' "$NAME" "$VALUE" >> "$FILE"
  fi
}

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
if grep -Eq '^ENVIRONMENT="?production"?$' "$TEMP_ENV" ||
  grep -Eq '^CONVEX_CLOUD_URL="?https://api\.ruby\.travel"?$' "$TEMP_ENV"; then
  rm -f "$TEMP_ENV"
  echo "Refusing to copy environment variables from the production Convex deployment." >&2
  exit 1
fi

npx convex deployment create "dev/$WT_NAME" --select --expiration "in 7 days" --type dev < /dev/null
npx convex deployment token create "$WT_NAME" --save-env < /dev/null

# Push env vars to the new deployment
if [ -s "$TEMP_ENV" ]; then
  npx convex env set --from-file "$TEMP_ENV" < /dev/null
  echo "copied environment variables to new deployment"
fi
rm -f "$TEMP_ENV"

AUTH_METADATA="$(curl -fsS "https://site.dev.ruby.travel/api/auth/convex/.well-known/openid-configuration")"
SHARED_AUTH_JWT_ISSUER="$(printf '%s' "$AUTH_METADATA" | node -e 'let data = ""; process.stdin.on("data", (chunk) => data += chunk); process.stdin.on("end", () => process.stdout.write(JSON.parse(data).issuer));')"
SHARED_AUTH_JWKS_URI="$(printf '%s' "$AUTH_METADATA" | node -e 'let data = ""; process.stdin.on("data", (chunk) => data += chunk); process.stdin.on("end", () => process.stdout.write(JSON.parse(data).jwks_uri));')"

set_env_var ".env.local" "SHARED_AUTH_JWT_ISSUER" "$SHARED_AUTH_JWT_ISSUER"
set_env_var ".env.local" "SHARED_AUTH_JWKS_URI" "$SHARED_AUTH_JWKS_URI"
npx convex env set SHARED_AUTH_JWT_ISSUER "$SHARED_AUTH_JWT_ISSUER" < /dev/null
npx convex env set SHARED_AUTH_JWKS_URI "$SHARED_AUTH_JWKS_URI" < /dev/null
echo "trusted shared auth issuer ${SHARED_AUTH_JWT_ISSUER}"

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
