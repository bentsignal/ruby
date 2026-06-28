export const POST_MEDIA_TYPES = ["image", "video"] as const;
export type PostMediaType = (typeof POST_MEDIA_TYPES)[number];
export const POST_UPLOAD_MEDIA_TYPES = ["image"] as const;
export const POST_UPLOAD_ACCEPT = POST_UPLOAD_MEDIA_TYPES.map(
  (mediaType) => `${mediaType}/*`,
).join(",");
export const POST_UPLOAD_ALLOWED_MEDIA_LABEL = "photos";
export const POST_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024;
export const POST_UPLOAD_MAX_SIZE_MEGABYTES =
  POST_UPLOAD_MAX_SIZE_BYTES / 1024 / 1024;
export const POST_UPLOAD_MAX_SIZE_LABEL = `${POST_UPLOAD_MAX_SIZE_MEGABYTES} MB`;
export const POST_UPLOAD_FILE_NAME_MAX_LENGTH = 255;
export const POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH = 128;
export const POST_UPLOAD_BLOCKED_CONTENT_TYPES = ["image/svg+xml"] as const;
export const POST_CAPTION_MAX_LENGTH = 2_200;
export const POST_MAX_FILES = 20;
export const POST_FEED_PAGE_SIZE = 10;
export const POST_DISPLAY_ASPECT_RATIOS = [
  "1:1",
  "4:3",
  "3:4",
  "16:9",
] as const;
export type PostDisplayAspectRatio =
  (typeof POST_DISPLAY_ASPECT_RATIOS)[number];
export const DEFAULT_POST_DISPLAY_ASPECT_RATIO = "4:3";

export function getPostDisplayAspectRatioValue(ratio: PostDisplayAspectRatio) {
  if (ratio === "1:1") return 1;
  if (ratio === "3:4") return 3 / 4;
  if (ratio === "16:9") return 16 / 9;
  return 4 / 3;
}

export function getClosestPostDisplayAspectRatio({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  const value = width / height;
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_POST_DISPLAY_ASPECT_RATIO;
  }

  const distances = POST_DISPLAY_ASPECT_RATIOS.map((ratio) => ({
    distance: Math.abs(getPostDisplayAspectRatioValue(ratio) - value),
    ratio,
  })).sort((a, b) => a.distance - b.distance);

  return distances[0]?.ratio ?? DEFAULT_POST_DISPLAY_ASPECT_RATIO;
}
