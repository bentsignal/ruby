import { v } from "convex/values";

export const vPermission = v.union(
  v.literal("can-access-app"),
  v.literal("can-post"),
);
