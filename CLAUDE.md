# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** containing a Next.js web app and Expo React Native app that share a Convex backend. Users share updates on their adventures through posts.

## Key Tech Stack

- React 19, React Native 0.81 (react compiled enabled)
- Expo SDK 54, Expo Router
- Tailwind CSS v4 (Uniwind on mobile)
- Convex for backend/db
- Better Auth for authentication
- Rostra for state management

## Commands

```bash
# Development
pnpm dev                # Run all apps in watch mode, you should ***NEVER*** do this without asking the user, since usually the dev server is already running

# Code quality
pnpm lint               # Lint all packages
pnpm lint:fix           # Lint and fix
pnpm format             # Check formatting
pnpm format:fix         # Fix formatting
pnpm typecheck          # TypeScript check across monorepo

# Adding components
pnpm ui-add             # Interactive shadcn/ui component installer, components from here can be used in the next.js web app, but NOT in the expo react native app

```

## Directory structure

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  │   ├─ Expo SDK 54
  │   ├─ React Native 0.81 using React 19
  │   ├─ Navigation using Expo Router
  │   └─ Tailwind CSS v4 using Uniwind
  └─ nextjs
      ├─ Next.js 16
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
- `src/auth.ts` - Better Auth integration with Convex, Google OAuth
- Auto-generated types in `src/_generated/`. DO NOT MAKE CHANGES IN HERE EVER.

API usage in apps:

```typescript
import { api } from "@acme/convex/api";

const posts = useQuery(api.posts.getAll);
```

### Authentication

Uses **Better Auth** with Convex adapter for both platforms:

- **Web**: `apps/nextjs/src/lib/auth-client.ts`, `auth-server.ts`
- **Mobile**: `apps/expo/src/features/auth/lib/auth-client.ts`
- OAuth handled via `@better-auth/expo` plugin with `ruby://` scheme on mobile

Auth should typically be handled through the Auth Store.

### State Management

Uses **Rostra** (lightweight hook-based store). Values returned from selectors will only re-render if the selected value changes

```typescript
import { useState } from "react";
import { createStore } from "rostra";

function useInternalStore({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(prev => prev + 1);
  return { count, increment };
};

const { Store, useStore } = createStore(useInternalStore);

function Counter() {
  return (
    <Store initialCount={10}>
      <Value />
      <IncrementButton />
    </Store>
  );
};

function Value() {
  const count = useStore(store => store.count);
  const isCountEven = useStore(store => store.count % 2 === 0);
  return <p>Count: {count}, {isCountEven ? "Count is even" : "Count is odd"</p>;
};

function IncrementButton() {
  const increment = useStore(store => store.increment);
  return <button onClick={increment}>Increment</button>;
};

```

These stores should typically not be global (with exceptions for things like auth). The idea is to have them as low as possible, but high enough that anything that needs the data in the store is below them.

### Environment Variables

Next.js, Expo, and Convex all have a file that shows what environment variables they require

- `./apps/nextjs/src/env.ts` Lists the environment variables that are required for the next.js app.
- `./apps/expo/src/expo.env.ts` Lists the environment variables that are required for the expo app.
- `./packages/convex/src/convex.env.ts` Lists the environment variables that are required for the Convex backend.
