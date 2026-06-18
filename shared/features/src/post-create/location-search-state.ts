import { useState } from "react";
import { useAction } from "convex/react";

import type {
  LocationPrediction,
  ResolvedLocation,
} from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";
import { api } from "@acme/convex/api";
import { useDebouncedInput } from "@acme/std/use-debounced-input";

import { parseResolvedLocation } from "./location-search-parsers";
import {
  createLocationSessionToken,
  createOptimisticLocation,
} from "./location-search-session";
import { useLocationPredictions } from "./use-location-predictions";

export function useLocationSearchState({
  isOpen,
  onResolveEnd,
  onResolveStart,
  onOpenChange,
  setLocation,
}: {
  isOpen: boolean;
  onResolveEnd?: () => void;
  onResolveStart?: () => void;
  onOpenChange: (isOpen: boolean) => void;
  setLocation: (location: ResolvedLocation) => void;
}) {
  const autocompleteAction = useAction(api.places.actions.autocomplete);
  const resolveLocationAction = useAction(api.places.actions.resolve);
  const [sessionToken, setSessionToken] = useState<string | null>(() =>
    isOpen ? createLocationSessionToken() : null,
  );
  const {
    value: search,
    setValue: setSearch,
    debouncedValue,
  } = useDebouncedInput({ initialValue: "", timeInMs: 350 });
  const {
    cancelPendingPredictions,
    isLoading,
    predictions,
    resetPredictions,
    searchError,
  } = useLocationPredictions({
    autocompleteAction,
    debouncedSearch: debouncedValue,
    isOpen,
    sessionToken,
  });

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      startSearchSession();
    } else {
      cancelPendingPredictions();
      setSessionToken(null);
    }

    setSearch("");
    onOpenChange(nextOpen);
  }

  function handleSearchChange(nextSearch: string) {
    setSearch(nextSearch);
    if (nextSearch.trim().length < PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH) {
      resetPredictions();
    }
  }

  function selectPrediction(prediction: LocationPrediction) {
    if (!sessionToken) return;

    if (onResolveStart) onResolveStart();
    else setLocation(createOptimisticLocation(prediction));
    handleOpenChange(false);

    void resolveLocationAction({
      placeId: prediction.placeId,
      selectedName: prediction.title,
      selectedSubtitle: prediction.subtitle,
      sessionToken,
    })
      .then(parseResolvedLocation)
      .then(setLocation, () => onResolveEnd?.());
  }

  function startSearchSession() {
    setSessionToken(createLocationSessionToken());
    resetPredictions();
  }

  return {
    handleOpenChange,
    isLoading,
    predictions,
    search,
    searchError,
    selectPrediction,
    setSearch: handleSearchChange,
  };
}
