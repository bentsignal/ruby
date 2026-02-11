---
name: atomic-design
description: Build UI using a modified Atomic Design system (atoms + molecules) with feature-first folders and direct composition. Use when creating or refactoring React/React Native components, or when the user mentions atomic design, atoms, molecules, feature folders, or composition.
---

# Atomic Design

## Core model

### Features

Keep code for a feature close together. Prefer placing UI, hooks, and stores under the feature directory so edits stay cohesive.

### Atoms

Atoms are the smallest reusable building blocks.

- Can contain any kind of code: components, store, hooks, types, constants.
- Keep atom components in separate files whenever practical.
- Can be built from other atoms.
- Must not depend on molecules.

### Molecules

Molecules compose atoms to solve a specific use-case.

- Tailored to a concrete widget/flow, possibly reusable.
- Typically one main component per file.
- Can be built from atoms and other molecules.

## Folder conventions (match this repo)

Inside a feature directory (example: `apps/web/src/features/search/`):

```text
features/search/
  store.ts (or store.tsx when required)
  atoms/
    input.tsx
    clear-button.tsx
    ...
  molecules/
    search-bar.tsx
```

### Public boundaries

- Do not create atom barrel files that mix store and components.
- Import atom components directly from their file paths.
- Keep feature store exports in `store.ts` or `store.tsx`.

## Composition rules

- Build molecules by importing atom components directly from `../atoms/<name>` or `~/features/<feature>/atoms/<name>`.
- If a feature needs scoped state/data, keep it in the feature store and provide it once at the screen/layout boundary.
- Atom components should read state via typed store selectors.
- Only promote something to a global atom (example: `~/atoms/button`) when it is genuinely cross-feature.

## Workflow

1. Decide the feature boundary where the change belongs.
2. Decide whether you are building:
   - an atom (reusable building block, used in multiple places), or
   - a molecule (a composed widget for a specific use-case).
3. If you need shared state across multiple atom components:
   - create or extend the feature store in `features/<feature>/store.ts` (or `store.tsx`)
   - export named store symbols from that file (for example `SearchStore`, `useSearchStore`)
4. Put each atom component in its own file under `atoms/`.
5. Compose molecules by importing atom components directly; screens compose molecules and wrap the feature `Store` once.
6. Enforce one-way dependency flow: atoms → atoms, molecules → atoms/molecules, screens → everything below.

## Example pattern

The following is an example for implementing a search feature.

### Feature store (`store.ts`)

```tsx
import { createStore } from "rostra";

import useDebouncedInput from "~/hooks/use-debounced-input";

function useInternalStore({ debounceTime = 500 }: { debounceTime?: number }) {
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput(debounceTime);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export const { Store: SearchStore, useStore: useSearchStore } =
  createStore(useInternalStore);
```

### Atom files (`atoms/container.tsx`, `atoms/input.tsx`, `atoms/clear-button.tsx`)

```tsx
import type { ReactNode } from "react";
import { View } from "react-native";

export function Container({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}
```

```tsx
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { useSearchStore } from "../store";

export function Input(props: TextInputProps) {
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  return (
    <TextInput value={searchTerm} onChangeText={setSearchTerm} {...props} />
  );
}
```

```tsx
import type { PressableProps } from "react-native";
import { Pressable } from "react-native";

import { useSearchStore } from "../store";

export function ClearButton(props: PressableProps) {
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const hideButton = useSearchStore((s) => s.searchTerm.length === 0);
  if (hideButton) return null;
  function clearInput {
    setSearchTerm("");
  }
  return <Pressable onPress={clearInput} {...props} />;
}

```

### Molecule (compose atoms via direct imports)

```tsx
import { ClearButton } from "../atoms/clear-button";
import { Container } from "../atoms/container";
import { Input } from "../atoms/input";

function SearchBar() {
  return (
    <Container>
      <Input />
      <ClearButton />
    </Container>
  );
}

export { SearchBar };
```

### Screen boundary (wrap the feature `Store` once)

```tsx
import { View } from "react-native";

import { SearchBar } from "~/features/search/molecules/search-bar";
import { SearchPageResults } from "~/features/search/molecules/search-page-results";
import { SearchStore } from "~/features/search/store";

export default function SearchPage() {
  return (
    <SearchStore>
      <View className="flex-1">
        <SearchPageResults />
        <SearchBar />
      </View>
    </SearchStore>
  );
}
```

## Reference

- Article: `https://blog.bentsignal.com/organize-react-projects`
