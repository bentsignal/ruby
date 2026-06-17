import type { PFPVariant } from "./types";

export function getPFPSizeNumber(variant: PFPVariant) {
  switch (variant) {
    case "sm":
      return 40;
    case "md":
      return 64;
    case "lg":
      return 96;
  }
}

export function getPFPClassName(variant: PFPVariant) {
  switch (variant) {
    case "sm":
      return "size-10";
    case "md":
      return "size-16";
    case "lg":
      return "size-24";
  }
}

export function normalizeProfileLink(link: string) {
  const trimmed = link.trim();
  if (!trimmed) return null;

  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    url = new URL(`https://${trimmed}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const hostname = url.hostname;
  if (!hostname) return null;

  const parts = hostname.split(".");

  let displayHostname = hostname;

  if (parts.length >= 3 && parts[0] === "www") {
    displayHostname = parts.slice(1).join(".");
  }

  return {
    href: url.toString(),
    display: displayHostname,
  };
}
