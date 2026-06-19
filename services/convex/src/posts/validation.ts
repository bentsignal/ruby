import { ConvexError } from "convex/values";

import {
  PLACE_FORMATTED_ADDRESS_MAX_LENGTH,
  PLACE_ID_MAX_LENGTH,
  PLACE_MAX_LATITUDE,
  PLACE_MAX_LONGITUDE,
  PLACE_MIN_LATITUDE,
  PLACE_MIN_LONGITUDE,
  PLACE_NAME_MAX_LENGTH,
} from "@acme/config/places";
import { POST_CAPTION_MAX_LENGTH, POST_MAX_FILES } from "@acme/config/posts";

import type { Id } from "../_generated/dataModel";
import type { AuthedMutationCtx } from "../utils";
import type { PostLocation } from "./types";
import { hasWhitespaceOrControlCharacter } from "../places/validation";

export function validatePostInput(
  rawCaption: string | undefined,
  attachments: Id<"files">[],
) {
  const caption = rawCaption?.trim();
  if (!caption && attachments.length === 0) {
    throw new ConvexError("Add media or a caption before posting");
  }
  if (caption && caption.length > POST_CAPTION_MAX_LENGTH) {
    throw new ConvexError("Caption is too long");
  }
  if (attachments.length > POST_MAX_FILES) {
    throw new ConvexError("Too many files");
  }
  if (new Set(attachments).size !== attachments.length) {
    throw new ConvexError("Duplicate files are not supported");
  }
  return caption;
}

export async function validatePostFiles(
  ctx: AuthedMutationCtx,
  attachments: Id<"files">[],
) {
  for (const fileId of attachments) {
    const file = await ctx.db.get(fileId);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadedBy !== ctx.myProfile._id) {
      throw new ConvexError("You can only post your own uploads");
    }
    if (file.status !== "uploaded") {
      throw new ConvexError("Wait for uploads to finish before posting");
    }
  }
}

export function validatePostLocation(rawLocation: PostLocation | undefined) {
  if (!rawLocation) return undefined;

  const googlePlaceId = rawLocation.googlePlaceId.trim();
  if (!googlePlaceId || hasWhitespaceOrControlCharacter(googlePlaceId)) {
    throw new ConvexError("Invalid location");
  }
  if (googlePlaceId.length > PLACE_ID_MAX_LENGTH) {
    throw new ConvexError("Location is too long");
  }

  const name = cleanOptional(rawLocation.name, PLACE_NAME_MAX_LENGTH);
  if (!name) throw new ConvexError("Invalid location");

  const formattedAddress = cleanOptional(
    rawLocation.formattedAddress,
    PLACE_FORMATTED_ADDRESS_MAX_LENGTH,
  );
  return {
    provider: "google",
    googlePlaceId,
    ...(name ? { name } : {}),
    ...(formattedAddress ? { formattedAddress } : {}),
    ...createCoordinatePatch("latitude", rawLocation.latitude, {
      max: PLACE_MAX_LATITUDE,
      min: PLACE_MIN_LATITUDE,
    }),
    ...createCoordinatePatch("longitude", rawLocation.longitude, {
      max: PLACE_MAX_LONGITUDE,
      min: PLACE_MIN_LONGITUDE,
    }),
  } satisfies PostLocation;
}

function cleanOptional(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function validateCoordinate(
  value: number | undefined,
  bounds: { min: number; max: number },
) {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value) || value < bounds.min || value > bounds.max) {
    throw new ConvexError("Invalid location");
  }
  return value;
}

function createCoordinatePatch(
  key: "latitude" | "longitude",
  value: number | undefined,
  bounds: { min: number; max: number },
) {
  const coordinate = validateCoordinate(value, bounds);
  return coordinate === undefined ? {} : { [key]: coordinate };
}
