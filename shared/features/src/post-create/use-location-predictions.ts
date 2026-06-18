import { useEffect, useRef, useState } from "react";

import type { LocationPrediction } from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";

import { parseLocationPredictions } from "./location-search-parsers";

type AutocompleteAction = (args: {
  input: string;
  sessionToken: string;
}) => Promise<unknown>;

export function useLocationPredictions({
  autocompleteAction,
  debouncedSearch,
  isOpen,
  sessionToken,
}: {
  autocompleteAction: AutocompleteAction;
  debouncedSearch: string;
  isOpen: boolean;
  sessionToken: string | null;
}) {
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const predictionCacheRef = useRef(new Map<string, LocationPrediction[]>());

  function resetPredictions() {
    requestIdRef.current += 1;
    predictionCacheRef.current.clear();
    setPredictions([]);
    setIsLoading(false);
    setSearchError(null);
  }

  function cancelPendingPredictions() {
    requestIdRef.current += 1;
  }

  // eslint-disable-next-line no-restricted-syntax -- Debounced Places autocomplete must sync input changes to Convex action calls.
  useEffect(() => {
    const input = debouncedSearch.trim();
    const requestId = ++requestIdRef.current;

    if (
      !isOpen ||
      !sessionToken ||
      input.length < PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH
    ) {
      return;
    }

    const cachedPredictions = predictionCacheRef.current.get(input);
    if (cachedPredictions) {
      setPredictions(cachedPredictions);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    void autocompleteAction({ input, sessionToken }).then(
      (value) => {
        if (requestIdRef.current !== requestId) return;
        const nextPredictions = parseLocationPredictions(value);
        predictionCacheRef.current.set(input, nextPredictions);
        setPredictions(nextPredictions);
        setIsLoading(false);
      },
      () => {
        if (requestIdRef.current !== requestId) return;
        setPredictions([]);
        setSearchError("Could not load locations");
        setIsLoading(false);
      },
    );
  }, [autocompleteAction, debouncedSearch, isOpen, sessionToken]);

  return {
    cancelPendingPredictions,
    isLoading,
    predictions,
    resetPredictions,
    searchError,
  };
}
