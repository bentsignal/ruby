export interface MapsLocation {
  name?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
}

function coordinatePair(location: MapsLocation) {
  if (
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  ) {
    return `${location.latitude},${location.longitude}`;
  }
  return null;
}

function searchQuery(location: MapsLocation) {
  return (
    location.name ?? location.formattedAddress ?? coordinatePair(location) ?? ""
  );
}

export function googleMapsWebUrl(location: MapsLocation) {
  const params = new URLSearchParams({
    api: "1",
    query: searchQuery(location),
  });

  if (location.googlePlaceId) {
    params.set("query_place_id", location.googlePlaceId);
  }

  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function appleMapsUrl(location: MapsLocation) {
  const params = new URLSearchParams();
  const label = searchQuery(location);
  const coordinates = coordinatePair(location);

  if (label) params.set("q", label);
  if (coordinates) params.set("ll", coordinates);

  return `https://maps.apple.com/?${params.toString()}`;
}

export function androidGeoUrl(location: MapsLocation) {
  const label = searchQuery(location);
  const coordinates = coordinatePair(location);

  if (coordinates) {
    const query = label ? `${coordinates}(${label})` : coordinates;
    return `geo:${coordinates}?q=${encodeURIComponent(query)}`;
  }

  return `geo:0,0?q=${encodeURIComponent(label)}`;
}
