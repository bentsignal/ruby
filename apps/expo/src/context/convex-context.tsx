"use client";

import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const getConvexUrl = () => {
  return __DEV__
    ? "https://outgoing-moose-159.convex.cloud"
    : "https://giddy-dogfish-113.convex.cloud";
};

const convex = new ConvexReactClient(getConvexUrl());

export function Provider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
