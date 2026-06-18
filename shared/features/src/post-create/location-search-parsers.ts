import type {
  LocationPrediction,
  ResolvedLocation,
} from "@acme/convex/places/types";

export function parseLocationPredictions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((prediction: unknown) =>
    parseLocationPrediction(prediction),
  );
}

export function parseResolvedLocation(value: unknown) {
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

function parseLocationPrediction(value: unknown) {
  const provider = readString(value, ["provider"]);
  const id = readString(value, ["id"]);
  const placeId = readString(value, ["placeId"]);
  const title = readString(value, ["title"]);
  const subtitle = readString(value, ["subtitle"]);
  if (provider !== "google" || !id || !placeId || !title) return [];

  return [
    {
      id,
      placeId,
      provider,
      subtitle,
      title,
    } satisfies LocationPrediction,
  ];
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
