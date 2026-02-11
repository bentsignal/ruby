import { useEffect, useRef } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createStore } from "rostra";

import useDebouncedInput from "~/hooks/use-debounced-input";

function useInternalStore({
  debounceTime = 500,
  initialSearchTerm,
  storeSearchTermInURL = false,
}: {
  debounceTime?: number;
  initialSearchTerm?: string;
  storeSearchTermInURL?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput({
    time: debounceTime,
    initialValue: initialSearchTerm,
  });

  const navigate = useNavigate();
  const urlSearchTerm = useSearch({
    from: "/_tabs/search",
    select: (s) => s.q,
  });

  useEffect(() => {
    if (!storeSearchTermInURL) return;
    if (urlSearchTerm === debouncedSearchTerm) return;

    const newSearch = debouncedSearchTerm ? { q: debouncedSearchTerm } : {};
    void navigate({
      to: ".",
      search: newSearch,
      replace: true,
    });
  }, [debouncedSearchTerm, storeSearchTermInURL, navigate, urlSearchTerm]);

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    focusInput,
    inputRef,
  };
}

export const { Store: SearchStore, useStore: useSearchStore } =
  createStore(useInternalStore);
