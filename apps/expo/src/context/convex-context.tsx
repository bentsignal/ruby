"use client";

import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const url =
  process.env.NODE_ENV === "development"
    ? "https://outgoing-moose-159.convex.cloud"
    : "bad-url";

const convex = new ConvexReactClient(url);

export function Provider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
