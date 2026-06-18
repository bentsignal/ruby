import { googleMapsWebUrl } from "@acme/std/maps";

import { usePostStore } from "../../store";

function formatFullDate(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function usePostDetails() {
  const createdAt = usePostStore((store) => store.createdAt);
  const location = usePostStore((store) => store.location);

  return {
    formattedDate: formatFullDate(createdAt),
    locationLabel: location?.name ?? location?.formattedAddress ?? null,
    mapUrl: location ? googleMapsWebUrl(location) : null,
  };
}
