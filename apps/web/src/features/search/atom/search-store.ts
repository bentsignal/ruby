"use client";

import { useEffect } from "react";
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
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput({
    time: debounceTime,
    initialValue: initialSearchTerm,
  });

  const navigate = useNavigate();
  const search = useSearch({ from: "/_tabs/search" });

  useEffect(() => {
    if (!storeSearchTermInURL) return;

    const currentQ = search.q ?? "";
    if (currentQ === searchTerm) return;

    const newSearch = searchTerm ? { q: searchTerm } : {};
    void navigate({
      to: ".",
      search: newSearch,
      replace: true,
    });
  }, [searchTerm, storeSearchTermInURL, navigate, search.q]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
