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
export const POST_FEED_PAGE_MAXIMUM_BYTES_READ = 1_000_000;
export const POST_FEED_PAGE_MAXIMUM_ROWS_READ = 250;
export const POST_FEED_PAGE_SIZE_MAX = 25;
