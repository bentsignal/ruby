const DEFAULT_DISPLAY_ERROR = "Something went wrong. Please try again.";
const MAX_DISPLAY_ERROR_LENGTH = 120;

export function getDisplayErrorMessage(
  error: unknown,
  fallback = DEFAULT_DISPLAY_ERROR,
) {
  if (error instanceof Error) {
    return sanitizeDisplayError(error.message, fallback);
  }
  if (typeof error === "string") return sanitizeDisplayError(error, fallback);

  return fallback;
}

function sanitizeDisplayError(message: string, fallback: string) {
  const trimmed = message.trim();
  const convexMessage = getConvexErrorMessage(trimmed);
  const displayMessage = convexMessage ?? trimmed;

  if (!displayMessage) return fallback;
  if (
    isUnsafeDisplayError({
      displayMessage,
      hasConvexMessage: convexMessage !== null,
      originalMessage: trimmed,
    })
  ) {
    return fallback;
  }

  return displayMessage;
}

function getConvexErrorMessage(message: string) {
  const match = /(?:Uncaught )?ConvexError:\s*([^\n]+)/u.exec(message);

  return match?.[1]?.trim() ?? null;
}

function isUnsafeDisplayError({
  displayMessage,
  hasConvexMessage,
  originalMessage,
}: {
  displayMessage: string;
  hasConvexMessage: boolean;
  originalMessage: string;
}) {
  if (displayMessage.length > MAX_DISPLAY_ERROR_LENGTH) return true;
  if (!hasConvexMessage && originalMessage.includes("\n")) return true;

  return [
    /\bat\s+\S+\s*\(/u,
    /\bError:/u,
    /\bstack\b/iu,
    /\btrace\b/iu,
    /\/src\//u,
    /\.[cm]?[jt]sx?:\d+/u,
    /https?:\/\//u,
  ].some((pattern) => pattern.test(displayMessage));
}
