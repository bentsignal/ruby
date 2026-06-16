interface GoogleAutocompleteResponse {
  suggestions: GoogleSuggestion[];
}

interface GoogleSuggestion {
  placePrediction?: GooglePlacePrediction;
}

interface GooglePlacePrediction {
  place?: string;
  placeId?: string;
  text?: {
    text?: string;
  };
  structuredFormat?: {
    mainText?: {
      text?: string;
    };
    secondaryText?: {
      text?: string;
    };
  };
}

export function parseAutocompleteResponse({
  limit,
  nameMaxLength,
  response,
  subtitleMaxLength,
}: {
  limit: number;
  nameMaxLength: number;
  response: GoogleAutocompleteResponse;
  subtitleMaxLength: number;
}) {
  const seenPlaceIds = new Set<string>();
  const provider = "google";

  return response.suggestions
    .flatMap((suggestion) =>
      predictionFromSuggestion({
        nameMaxLength,
        provider,
        seenPlaceIds,
        subtitleMaxLength,
        suggestion,
      }),
    )
    .slice(0, limit);
}

export function parseGoogleAutocompleteResponse(value: unknown) {
  return {
    suggestions: readSuggestions(value).map(parseGoogleSuggestion),
  };
}

export function parseGooglePlaceDetailsId(value: unknown) {
  return readString(value, ["id"]);
}

export function parseGoogleError(value: unknown) {
  const code = readNumber(value, ["error", "code"]);
  const status = readString(value, ["error", "status"]);
  if (code === undefined && !status) return undefined;
  return { code, status };
}

function predictionFromSuggestion({
  nameMaxLength,
  provider,
  seenPlaceIds,
  subtitleMaxLength,
  suggestion,
}: {
  nameMaxLength: number;
  provider: "google";
  seenPlaceIds: Set<string>;
  subtitleMaxLength: number;
  suggestion: GoogleSuggestion;
}) {
  const prediction = suggestion.placePrediction;
  if (!prediction) return [];

  const placeId =
    cleanOptional(prediction.placeId, 256) ??
    placeIdFromResourceName(prediction.place);
  if (!placeId || seenPlaceIds.has(placeId)) return [];

  const title = getPredictionTitle({ nameMaxLength, prediction });
  if (!title) return [];

  const subtitle = cleanOptional(
    prediction.structuredFormat?.secondaryText?.text,
    subtitleMaxLength,
  );

  seenPlaceIds.add(placeId);
  if (!subtitle) {
    return [{ id: `google:${placeId}`, placeId, provider, title }];
  }
  return [{ id: `google:${placeId}`, placeId, provider, subtitle, title }];
}

function getPredictionTitle({
  nameMaxLength,
  prediction,
}: {
  nameMaxLength: number;
  prediction: GooglePlacePrediction;
}) {
  return cleanOptional(
    prediction.structuredFormat?.mainText?.text ?? prediction.text?.text,
    nameMaxLength,
  );
}

function parseGoogleSuggestion(value: unknown) {
  return {
    placePrediction: {
      place: readString(value, ["placePrediction", "place"]),
      placeId: readString(value, ["placePrediction", "placeId"]),
      structuredFormat: {
        mainText: {
          text: readString(value, [
            "placePrediction",
            "structuredFormat",
            "mainText",
            "text",
          ]),
        },
        secondaryText: {
          text: readString(value, [
            "placePrediction",
            "structuredFormat",
            "secondaryText",
            "text",
          ]),
        },
      },
      text: {
        text: readString(value, ["placePrediction", "text", "text"]),
      },
    },
  };
}

function readSuggestions(value: unknown) {
  const suggestions = readPath(value, ["suggestions"]);
  if (!Array.isArray(suggestions)) return [];
  return suggestions.map((suggestion: unknown) => suggestion);
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
    if (typeof current !== "object" || current === null) return undefined;
    current = Reflect.get(current, key);
  }
  return current;
}

function placeIdFromResourceName(place: string | undefined) {
  const trimmed = place?.trim();
  if (!trimmed?.startsWith("places/")) return undefined;
  return cleanOptional(trimmed.slice("places/".length), 256);
}

function cleanOptional(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}
