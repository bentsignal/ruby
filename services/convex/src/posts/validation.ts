import { ConvexError } from "convex/values";

import { POST_CAPTION_MAX_LENGTH, POST_MAX_FILES } from "@acme/config/posts";

import type { Id } from "../_generated/dataModel";
import type { AuthedMutationCtx } from "../utils";
import type { PostLocation } from "./types";

const POST_LOCATION_PLACE_ID_MAX_LENGTH = 256;
const POST_LOCATION_NAME_MAX_LENGTH = 160;
const POST_LOCATION_ADDRESS_MAX_LENGTH = 280;

export function validatePostInput(
  rawCaption: string | undefined,
  fileIds: Id<"files">[],
) {
  const caption = rawCaption?.trim();
  if (!caption && fileIds.length === 0) {
    throw new ConvexError("Add media or a caption before posting");
  }
  if (caption && caption.length > POST_CAPTION_MAX_LENGTH) {
    throw new ConvexError("Caption is too long");
  }
  if (fileIds.length > POST_MAX_FILES) {
    throw new ConvexError("Too many files");
  }
  if (new Set(fileIds).size !== fileIds.length) {
    throw new ConvexError("Duplicate files are not supported");
  }
  return caption;
}

export async function validatePostFiles(
  ctx: AuthedMutationCtx,
  fileIds: Id<"files">[],
) {
  for (const fileId of fileIds) {
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
  if (!googlePlaceId) {
    throw new ConvexError("Invalid location");
  }
  if (googlePlaceId.length > POST_LOCATION_PLACE_ID_MAX_LENGTH) {
    throw new ConvexError("Location is too long");
  }

  const name = cleanOptional(rawLocation.name, POST_LOCATION_NAME_MAX_LENGTH);
  const formattedAddress = cleanOptional(
    rawLocation.formattedAddress,
    POST_LOCATION_ADDRESS_MAX_LENGTH,
  );
  return {
    provider: "google",
    googlePlaceId,
    ...(name ? { name } : {}),
    ...(formattedAddress ? { formattedAddress } : {}),
    ...createCoordinatePatch("latitude", rawLocation.latitude),
    ...createCoordinatePatch("longitude", rawLocation.longitude),
  } satisfies PostLocation;
}

function cleanOptional(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function validateCoordinate(value: number | undefined) {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value)) throw new ConvexError("Invalid location");
  return value;
}

function createCoordinatePatch(
  key: "latitude" | "longitude",
  value: number | undefined,
) {
  const coordinate = validateCoordinate(value);
  return coordinate === undefined ? {} : { [key]: coordinate };
}
