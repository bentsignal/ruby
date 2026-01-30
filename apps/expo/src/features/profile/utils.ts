import type { PFPVariant } from "./types";

interface NormalizedProfileLink {
  href: string;
  display: string;
}

function getPFPSizeNumber(variant: PFPVariant) {
  switch (variant) {
    case "sm":
      return 48;
    case "md":
      return 64;
    case "lg":
      return 96;
  }
}

function getPFPClassName(variant: PFPVariant) {
  switch (variant) {
    case "sm":
      return "size-10";
    case "md":
      return "size-16";
    case "lg":
      return "size-24";
  }
}

function normalizeProfileLink(link: string): NormalizedProfileLink | null {
  const trimmed = link.trim();
  if (!trimmed) return null;

  const href = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const withoutScheme = href.replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, "");
  const hostWithPort = withoutScheme.split("/")[0] ?? "";
  const host = hostWithPort.replace(/:\d+$/, "");
  const display = host.startsWith("www.") ? host.slice(4) : host;
  if (!display) return null;
  return { href, display };
}

export { getPFPSizeNumber, getPFPClassName, normalizeProfileLink };
