import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

const LOCATION_SEARCH_STORE_WRITE_DELAY_MS = 180;

export function useLocationSearchInput({
  isOpen,
  search,
  setSearch,
}: {
  isOpen: boolean;
  search: string;
  setSearch: (search: string) => void;
}) {
  const latestSearchRef = useRef(search);
  const storeWriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // eslint-disable-next-line no-restricted-syntax -- Clears a pending deferred store write if this native input unmounts.
  useEffect(() => {
    return () => {
      clearStoreWriteTimeout(storeWriteTimeoutRef);
    };
  }, []);

  // eslint-disable-next-line no-restricted-syntax -- Keeps the deferred native input value aligned after search sheet resets.
  useEffect(() => {
    latestSearchRef.current = search;
    if (!isOpen) clearStoreWriteTimeout(storeWriteTimeoutRef);
  }, [search, isOpen]);

  function flushSearchToStore() {
    clearStoreWriteTimeout(storeWriteTimeoutRef);
    setSearch(latestSearchRef.current);
  }

  function handleChangeText(nextSearch: string) {
    latestSearchRef.current = nextSearch;
    clearStoreWriteTimeout(storeWriteTimeoutRef);
    storeWriteTimeoutRef.current = setTimeout(() => {
      storeWriteTimeoutRef.current = null;
      setSearch(latestSearchRef.current);
    }, LOCATION_SEARCH_STORE_WRITE_DELAY_MS);
  }

  return {
    defaultValue: search,
    inputKey: isOpen ? "open" : "closed",
    onBlur: flushSearchToStore,
    onChangeText: handleChangeText,
    onSubmitEditing: flushSearchToStore,
  };
}

function clearStoreWriteTimeout(
  timeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (!timeoutRef.current) return;
  clearTimeout(timeoutRef.current);
  timeoutRef.current = null;
}
