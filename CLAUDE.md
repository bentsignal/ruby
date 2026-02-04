# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** containing a TanStack Start web app and Expo React Native app that share a Convex backend. Users share updates on their adventures through posts.

## Key Tech Stack

- React 19, React Native 0.81 (react compiler enabled)
- TanStack Start (Vite + TanStack Router) for web
- Expo SDK 54, Expo Router for mobile
- Tailwind CSS v4 (Uniwind on mobile)
- Convex for backend/db
- Better Auth for authentication
- Rostra for state management

Since the react compiler is enabled, you often don't need to manually memoize with useMemo and useCallback.

## Commands

This project uses pnpm for package management.

```bash
# Development
pnpm dev                # Run all apps in watch mode, you should ***NEVER*** do this without asking the user, since the dev server is usually already running

# Code quality
pnpm lint               # Lint all packages
pnpm lint:fix           # Lint and fix
pnpm format             # Check formatting
pnpm format:fix         # Fix formatting
pnpm typecheck          # TypeScript check across monorepo

# Adding components
pnpm ui-add             # Interactive shadcn/ui component installer, components from here can be used in the web app, but NOT in the expo react native app

```

To run a command for a specific app or package, use `--filter <target-name>`

### Examples

- Installing zustand to the web app: `pnpm i zustand --filter @acme/web`
- Running lint on the convex backend: `pnpm run lint --filter convex`
- Running typecheck on the expo mobile app: `pnpm run typecheck --filter expo`

When you have finished making changes for the user, make sure to run the following commands:

1. `pnpm run lint`
2. `pnpm run format:fix`s
3. `pnpm run typecheck`

Make sure that these are all passing before you stop working.

## Directory structure

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ mobile
  │   ├─ Expo SDK 54
  │   ├─ React Native 0.81 using React 19
  │   ├─ Navigation using Expo Router
  │   └─ Tailwind CSS v4 using Uniwind
  └─ web
      ├─ TanStack Start (Vite + TanStack Router)
      ├─ React 19
      └─ Tailwind CSS v4
packages
  ├─ convex
  │   └─ backend, db, auth. pretty much everything under the hood
  └─ ui
      └─ Components from shadcn registries.
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ tailwind
  │   └─ shared tailwind theme and configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

### Backend (packages/convex)

Uses **Convex** as the backend-as-a-service.

- `src/schema.ts` - Database schema.
- `src/auth.ts` - Better Auth integration with Google OAuth
- Auto-generated code in `src/_generated/`. DO NOT MAKE CHANGES IN HERE EVER.

API usage in apps:

```typescript
import { api } from "@acme/convex/api";

const posts = useQuery(api.posts.getAll);
```

### Authentication

Uses **Better Auth** with Convex adapter for both platforms:

- **Web**: `apps/web/src/lib/auth-client.ts`, `auth-server.ts`
- **Mobile**: `apps/mobile/src/features/auth/lib/auth-client.ts`
- OAuth handled via `@better-auth/expo` plugin with `ruby://` scheme on mobile

Auth should typically be handled through the Auth Store.

### Environment Variables

Web, Mobile, and Convex all have a file that shows what environment variables they require

- Web: `./apps/web/src/env.ts`
- Mobile: `./apps/mobile/src/expo.env.ts`
- Convex: `./packages/convex/src/convex.env.ts`
