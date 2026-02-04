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

export const { Store, useStore } = createStore(useInternalStore);
