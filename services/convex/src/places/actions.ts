import { ConvexError, v } from "convex/values";

import type { ActionCtx } from "../_generated/server";
import type { ResolvedLocation } from "./types";
import { action } from "../_generated/server";
import { rateLimiter } from "../limiter";
import {
  parseAutocompleteResponse,
  parseGoogleAutocompleteResponse,
  parseGoogleError,
  parseGooglePlaceDetails,
} from "./google";
import { vLocationPrediction, vResolvedLocation } from "./validators";

const GOOGLE_AUTOCOMPLETE_URL =
  "https://places.googleapis.com/v1/places:autocomplete";
const GOOGLE_PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
const AUTOCOMPLETE_INPUT_MIN_LENGTH = 3;
const AUTOCOMPLETE_INPUT_MAX_LENGTH = 120;
const SESSION_TOKEN_MAX_LENGTH = 128;
const PLACE_ID_MAX_LENGTH = 256;
const LOCATION_NAME_MAX_LENGTH = 160;
const LOCATION_SUBTITLE_MAX_LENGTH = 280;
const AUTOCOMPLETE_LIMIT = 5;

export const autocomplete = action({
  args: {
    input: v.string(),
    sessionToken: v.string(),
    languageCode: v.optional(v.string()),
    regionCode: v.optional(v.string()),
  },
  returns: v.array(vLocationPrediction),
  handler: async (ctx, args) => {
    const user = await requireIdentity(ctx);
    const input = validateAutocompleteInput(args.input);
    const sessionToken = validateSessionToken(args.sessionToken);

    const { ok } = await rateLimiter.limit(ctx, "placesAutocomplete", {
      key: user.subject,
    });
    if (!ok) throw new ConvexError("Could not load locations");

    const response = await fetchGoogleAutocomplete({
      input,
      languageCode: cleanOptional(args.languageCode, 16),
      regionCode: cleanOptional(args.regionCode, 8),
      sessionToken,
    });

    return parseAutocompleteResponse({
      limit: AUTOCOMPLETE_LIMIT,
      nameMaxLength: LOCATION_NAME_MAX_LENGTH,
      response,
      subtitleMaxLength: LOCATION_SUBTITLE_MAX_LENGTH,
    });
  },
});

export const resolve = action({
  args: {
    placeId: v.string(),
    sessionToken: v.string(),
    selectedName: v.string(),
    selectedSubtitle: v.optional(v.string()),
  },
  returns: vResolvedLocation,
  handler: async (ctx, args) => {
    const user = await requireIdentity(ctx);
    const placeId = validatePlaceId(args.placeId);
    const sessionToken = validateSessionToken(args.sessionToken);
    const selectedName = validateSelectedText(
      args.selectedName,
      LOCATION_NAME_MAX_LENGTH,
      "Invalid location",
    );
    const selectedSubtitle = args.selectedSubtitle
      ? validateSelectedText(
          args.selectedSubtitle,
          LOCATION_SUBTITLE_MAX_LENGTH,
          "Invalid location",
        )
      : undefined;

    const { ok } = await rateLimiter.limit(ctx, "placesResolve", {
      key: user.subject,
    });
    if (!ok) throw new ConvexError("Could not select location");

    const details = await fetchGooglePlaceDetails({
      placeId,
      sessionToken,
    });
    const resolvedPlaceId = details.id;
    if (resolvedPlaceId !== placeId) {
      throw new ConvexError("Could not select location");
    }

    const name = cleanOptional(
      details.displayName.text,
      LOCATION_NAME_MAX_LENGTH,
    );
    const formattedAddress = cleanOptional(
      details.formattedAddress,
      LOCATION_SUBTITLE_MAX_LENGTH,
    );
    return createResolvedLocation({
      formattedAddress: formattedAddress ?? selectedSubtitle,
      googlePlaceId: resolvedPlaceId,
      latitude: details.location.latitude,
      longitude: details.location.longitude,
      name: name ?? selectedName,
    });
  },
});

async function requireIdentity(ctx: ActionCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new ConvexError("Unauthenticated");
  return user;
}

async function fetchGoogleAutocomplete({
  input,
  languageCode,
  regionCode,
  sessionToken,
}: {
  input: string;
  languageCode?: string;
  regionCode?: string;
  sessionToken: string;
}) {
  const response = await fetch(GOOGLE_AUTOCOMPLETE_URL, {
    body: JSON.stringify({
      input,
      languageCode,
      regionCode,
      sessionToken,
    }),
    headers: googleHeaders(
      "suggestions.placePrediction.place,suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
    ),
    method: "POST",
  });
  const body = await readGoogleResponseJson(response);

  if (!response.ok) {
    console.warn("Google Places autocomplete failed", {
      googleError: body ? parseGoogleError(body) : undefined,
      status: response.status,
    });
    throw new ConvexError("Could not load locations");
  }

  const googleError = body ? parseGoogleError(body) : undefined;
  if (googleError) {
    console.warn("Google Places autocomplete returned error body", {
      googleError,
      status: response.status,
    });
    throw new ConvexError("Could not load locations");
  }

  return parseGoogleAutocompleteResponse(body);
}

async function fetchGooglePlaceDetails({
  placeId,
  sessionToken,
}: {
  placeId: string;
  sessionToken: string;
}) {
  const url = new URL(
    `${GOOGLE_PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}`,
  );
  url.searchParams.set("sessionToken", sessionToken);

  const response = await fetch(url, {
    headers: googleHeaders("id,displayName,formattedAddress,location"),
    method: "GET",
  });
  const body = await readGoogleResponseJson(response);

  if (!response.ok) {
    console.warn("Google Places details failed", {
      googleError: body ? parseGoogleError(body) : undefined,
      status: response.status,
    });
    throw new ConvexError("Could not select location");
  }

  const googleError = body ? parseGoogleError(body) : undefined;
  if (googleError) {
    console.warn("Google Places details returned error body", {
      googleError,
      status: response.status,
    });
    throw new ConvexError("Could not select location");
  }

  const details = parseGooglePlaceDetails(body);
  if (!details.id) throw new ConvexError("Could not select location");
  return details;
}

async function readGoogleResponseJson(response: Response) {
  try {
    return toUnknown(await response.json());
  } catch {
    return undefined;
  }
}

function toUnknown(value: unknown) {
  return value;
}

function googleHeaders(fieldMask: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    throw new ConvexError("Location search is unavailable");
  }

  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldMask,
  };
}

function validateAutocompleteInput(input: string) {
  const trimmed = input.trim();
  if (trimmed.length < AUTOCOMPLETE_INPUT_MIN_LENGTH) {
    throw new ConvexError("Location search is too short");
  }
  if (trimmed.length > AUTOCOMPLETE_INPUT_MAX_LENGTH) {
    throw new ConvexError("Location search is too long");
  }
  return trimmed;
}

function validateSessionToken(sessionToken: string) {
  const trimmed = sessionToken.trim();
  if (!trimmed || trimmed.length > SESSION_TOKEN_MAX_LENGTH) {
    throw new ConvexError("Invalid location session");
  }
  return trimmed;
}

function validatePlaceId(placeId: string) {
  const trimmed = placeId.trim();
  if (!trimmed || trimmed.length > PLACE_ID_MAX_LENGTH) {
    throw new ConvexError("Invalid location");
  }
  return trimmed;
}

function validateSelectedText(text: string, maxLength: number, error: string) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > maxLength) {
    throw new ConvexError(error);
  }
  return trimmed;
}

function cleanOptional(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function createResolvedLocation({
  formattedAddress,
  googlePlaceId,
  latitude,
  longitude,
  name,
}: {
  formattedAddress?: string;
  googlePlaceId: string;
  latitude?: number;
  longitude?: number;
  name: string;
}) {
  return {
    provider: "google",
    googlePlaceId,
    name,
    ...(formattedAddress ? { formattedAddress } : {}),
    ...(latitude === undefined ? {} : { latitude }),
    ...(longitude === undefined ? {} : { longitude }),
  } satisfies ResolvedLocation;
}
