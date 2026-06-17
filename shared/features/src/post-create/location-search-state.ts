import { useEffect, useRef, useState } from "react";
import { useAction } from "convex/react";

import type {
  LocationPrediction,
  ResolvedLocation,
} from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";
import { api } from "@acme/convex/api";
import { useDebouncedInput } from "@acme/std/use-debounced-input";

interface MutableRef<T> {
  current: T;
}

interface AutocompleteArgs {
  input: string;
  sessionToken: string;
}

export function useLocationSearchState({
  isOpen,
  onOpenChange,
  setLocation,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setLocation: (location: ResolvedLocation) => void;
}) {
  const autocompleteAction = useAction(api.places.actions.autocomplete);
  const resolveLocationAction = useAction(api.places.actions.resolve);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const predictionCacheRef = useRef(new Map<string, LocationPrediction[]>());
  const {
    value: search,
    setValue: setSearch,
    debouncedValue,
  } = useDebouncedInput({ initialValue: "", timeInMs: 350 });

  // eslint-disable-next-line no-restricted-syntax -- Debounced Places autocomplete must sync input changes to Convex action calls.
  useEffect(() => {
    loadPredictions({
      autocompleteAction,
      debouncedValue,
      isOpen,
      predictionCacheRef,
      requestIdRef,
      sessionToken,
      setIsLoading,
      setPredictions,
      setSearchError,
    });
  }, [autocompleteAction, debouncedValue, isOpen, sessionToken]);

  // eslint-disable-next-line no-restricted-syntax -- The parent controls the search surface directly, so the search session must follow that external open state.
  useEffect(() => {
    if (!isOpen || sessionToken) return;

    startSearchSession({
      predictionCacheRef,
      setPredictions,
      setSearchError,
      setSessionToken,
    });
  }, [isOpen, sessionToken]);

  function handleOpenChange(nextOpen: boolean) {
    resetSearchSession({
      nextOpen,
      onOpenChange,
      predictionCacheRef,
      requestIdRef,
      setPredictions,
      setSearch,
      setSearchError,
      setSessionToken,
    });
  }

  function selectPrediction(prediction: LocationPrediction) {
    if (!sessionToken) return;

    setLocation(createOptimisticLocation(prediction));
    handleOpenChange(false);

    void resolveLocationAction({
      placeId: prediction.placeId,
      selectedName: prediction.title,
      selectedSubtitle: prediction.subtitle,
      sessionToken,
    })
      .then(parseResolvedLocation)
      .then(setLocation, () => undefined);
  }

  return {
    handleOpenChange,
    isLoading,
    predictions,
    search,
    searchError,
    selectPrediction,
    setSearch,
  };
}

function loadPredictions({
  autocompleteAction,
  debouncedValue,
  isOpen,
  predictionCacheRef,
  requestIdRef,
  sessionToken,
  setIsLoading,
  setPredictions,
  setSearchError,
}: {
  autocompleteAction: (args: AutocompleteArgs) => Promise<unknown>;
  debouncedValue: string;
  isOpen: boolean;
  predictionCacheRef: MutableRef<Map<string, LocationPrediction[]>>;
  requestIdRef: MutableRef<number>;
  sessionToken: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setPredictions: (predictions: LocationPrediction[]) => void;
  setSearchError: (error: string | null) => void;
}) {
  const requestId = ++requestIdRef.current;
  const input = debouncedValue.trim();

  if (
    !isOpen ||
    !sessionToken ||
    input.length < PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH
  ) {
    clearPredictionState({ setIsLoading, setPredictions, setSearchError });
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
}

function resetSearchSession({
  nextOpen,
  onOpenChange,
  predictionCacheRef,
  requestIdRef,
  setPredictions,
  setSearch,
  setSearchError,
  setSessionToken,
}: {
  nextOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  predictionCacheRef: MutableRef<Map<string, LocationPrediction[]>>;
  requestIdRef: MutableRef<number>;
  setPredictions: (predictions: LocationPrediction[]) => void;
  setSearch: (search: string) => void;
  setSearchError: (error: string | null) => void;
  setSessionToken: (token: string | null) => void;
}) {
  if (nextOpen) {
    startSearchSession({
      predictionCacheRef,
      setPredictions,
      setSearchError,
      setSessionToken,
    });
  } else {
    requestIdRef.current += 1;
    setSessionToken(null);
  }

  setSearch("");
  setPredictions([]);
  setSearchError(null);
  onOpenChange(nextOpen);
}

function startSearchSession({
  predictionCacheRef,
  setPredictions,
  setSearchError,
  setSessionToken,
}: {
  predictionCacheRef: MutableRef<Map<string, LocationPrediction[]>>;
  setPredictions: (predictions: LocationPrediction[]) => void;
  setSearchError: (error: string | null) => void;
  setSessionToken: (token: string | null) => void;
}) {
  setSessionToken(createLocationSessionToken());
  predictionCacheRef.current.clear();
  setPredictions([]);
  setSearchError(null);
}

function createOptimisticLocation(prediction: LocationPrediction) {
  return {
    formattedAddress: prediction.subtitle,
    googlePlaceId: prediction.placeId,
    name: prediction.title,
    provider: prediction.provider,
  } satisfies ResolvedLocation;
}

function parseLocationPredictions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((prediction: unknown) =>
    parseLocationPrediction(prediction),
  );
}

function parseLocationPrediction(value: unknown) {
  const provider = readString(value, ["provider"]);
  const id = readString(value, ["id"]);
  const placeId = readString(value, ["placeId"]);
  const title = readString(value, ["title"]);
  const subtitle = readString(value, ["subtitle"]);
  if (provider !== "google" || !id || !placeId || !title) return [];
  const prediction = {
    id,
    placeId,
    provider,
    subtitle,
    title,
  } satisfies LocationPrediction;
  return [prediction];
}

function parseResolvedLocation(value: unknown) {
  const provider = readString(value, ["provider"]);
  const googlePlaceId = readString(value, ["googlePlaceId"]);
  const name = readString(value, ["name"]);
  const formattedAddress = readString(value, ["formattedAddress"]);
  const latitude = readNumber(value, ["latitude"]);
  const longitude = readNumber(value, ["longitude"]);
  if (provider !== "google" || !googlePlaceId || !name) {
    throw new Error("Invalid location");
  }
  return {
    formattedAddress,
    googlePlaceId,
    latitude,
    longitude,
    name,
    provider,
  } satisfies ResolvedLocation;
}

function readString(value: unknown, path: string[]) {
  const found = readPath(value, path);
  if (typeof found !== "string") return undefined;
  return found;
}

function readNumber(value: unknown, path: string[]) {
  const found = readPath(value, path);
  if (typeof found !== "number") return undefined;
  return found;
}

function readPath(value: unknown, path: string[]) {
  let current = value;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

function clearPredictionState({
  setIsLoading,
  setPredictions,
  setSearchError,
}: {
  setIsLoading: (isLoading: boolean) => void;
  setPredictions: (predictions: LocationPrediction[]) => void;
  setSearchError: (error: string | null) => void;
}) {
  setPredictions([]);
  setIsLoading(false);
  setSearchError(null);
}

function createLocationSessionToken() {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return fallbackLocationSessionToken();
  }
}

function fallbackLocationSessionToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
