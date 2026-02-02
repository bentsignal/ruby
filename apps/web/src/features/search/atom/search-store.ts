"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!storeSearchTermInURL) return;

    const currentQ = searchParams.get("q") ?? "";
    if (currentQ === debouncedSearchTerm) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("q", debouncedSearchTerm);
    } else {
      params.delete("q");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearchTerm, storeSearchTermInURL, router, searchParams]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
