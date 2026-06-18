import type { PostLocation } from "@acme/convex/posts/types";

export interface PostDetailsParams {
  createdAt?: string;
  formattedAddress?: string;
  googlePlaceId?: string;
  latitude?: string;
  locationName?: string;
  longitude?: string;
}

export type PostDetailsSearchParams = Record<string, string | string[]>;

export function normalizePostDetailsParams(params: PostDetailsSearchParams) {
  return {
    createdAt: firstParam(params.createdAt),
    formattedAddress: firstParam(params.formattedAddress),
    googlePlaceId: firstParam(params.googlePlaceId),
    latitude: firstParam(params.latitude),
    locationName: firstParam(params.locationName),
    longitude: firstParam(params.longitude),
  };
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function optionalCoordinate(value?: number) {
  return typeof value === "number" ? String(value) : "";
}

export function createPostDetailsParams({
  createdAt,
  location,
}: {
  createdAt: number;
  location?: PostLocation;
}) {
  return {
    createdAt: String(createdAt),
    formattedAddress: location?.formattedAddress ?? "",
    googlePlaceId: location?.googlePlaceId ?? "",
    latitude: optionalCoordinate(location?.latitude),
    locationName: location?.name ?? "",
    longitude: optionalCoordinate(location?.longitude),
  };
}
