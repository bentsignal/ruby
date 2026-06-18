import { Linking, Platform } from "react-native";
import { createStore } from "rostra";

import { androidGeoUrl, appleMapsUrl, googleMapsWebUrl } from "@acme/std/maps";

import type { PostDetailsParams } from "./lib/params";

function formatFullDate(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function parseCoordinate(value?: string) {
  if (!value) return undefined;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

function optionalParam(value?: string) {
  return value === "" ? undefined : value;
}

function buildLocation(params: PostDetailsParams) {
  const latitude = parseCoordinate(params.latitude);
  const longitude = parseCoordinate(params.longitude);
  const formattedAddress = optionalParam(params.formattedAddress);
  const googlePlaceId = optionalParam(params.googlePlaceId);
  const name = optionalParam(params.locationName);

  if (!name && !formattedAddress && latitude === undefined) return null;

  return {
    formattedAddress,
    googlePlaceId,
    latitude,
    longitude,
    name,
  };
}

function useInternalStore({ params }: { params: PostDetailsParams }) {
  const location = buildLocation(params);
  const timestamp = Number(params.createdAt);
  const formattedDate = Number.isFinite(timestamp)
    ? formatFullDate(timestamp)
    : "";

  function openInMaps() {
    if (!location) return;

    const url = Platform.select({
      android: androidGeoUrl(location),
      ios: appleMapsUrl(location),
      default: googleMapsWebUrl(location),
    });

    void Linking.openURL(url).catch(() =>
      Linking.openURL(googleMapsWebUrl(location)),
    );
  }

  return {
    formattedDate,
    locationLabel: location?.name ?? location?.formattedAddress ?? null,
    openInMaps,
  };
}

export const { Store: PostDetailsStore, useStore: usePostDetailsStore } =
  createStore(useInternalStore);
