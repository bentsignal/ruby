import { createStore } from "rostra";

import { useDebouncedInput } from "@acme/std/use-debounced-input";

function useInternalStore({ debounceTime = 500 }: { debounceTime?: number }) {
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput({
    timeInMs: debounceTime,
    initialValue: "",
  });

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export const { Store: SearchStore, useStore: useSearchStore } =
  createStore(useInternalStore);
