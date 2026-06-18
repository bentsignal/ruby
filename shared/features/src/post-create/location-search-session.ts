import type {
  LocationPrediction,
  ResolvedLocation,
} from "@acme/convex/places/types";

export function createOptimisticLocation(prediction: LocationPrediction) {
  return {
    formattedAddress: prediction.subtitle,
    googlePlaceId: prediction.placeId,
    name: prediction.title,
    provider: prediction.provider,
  } satisfies ResolvedLocation;
}

export function createLocationSessionToken() {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return fallbackLocationSessionToken();
  }
}

function fallbackLocationSessionToken() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
