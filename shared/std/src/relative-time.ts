const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Compact, social-style timestamp: `now`, `5m`, `3h`, `2d`, `4w`, then an
 * absolute date (`Mar 4`, or `Mar 4, 2023` for a different year).
 */
export function formatRelativeTime(timestamp: number, now = Date.now()) {
  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE) return "now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d`;

  const date = new Date(timestamp);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();

  if (diff < 4 * WEEK) return `${Math.floor(diff / WEEK)}w`;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
