export const POST_MEDIA_TYPES = ["image", "video"] as const;
export type PostMediaType = (typeof POST_MEDIA_TYPES)[number];
export const POST_UPLOAD_ACCEPT = POST_MEDIA_TYPES.map(
  (mediaType) => `${mediaType}/*`,
).join(",");
export const POST_UPLOAD_ALLOWED_MEDIA_LABEL = "photos and videos";
export const POST_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024;
export const POST_UPLOAD_MAX_SIZE_MEGABYTES =
  POST_UPLOAD_MAX_SIZE_BYTES / 1024 / 1024;
export const POST_UPLOAD_MAX_SIZE_LABEL = `${POST_UPLOAD_MAX_SIZE_MEGABYTES} MB`;
export const POST_CAPTION_MAX_LENGTH = 2_200;
export const POST_MAX_FILES = 20;
