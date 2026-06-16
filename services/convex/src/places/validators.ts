import { v } from "convex/values";

export const vLocationPrediction = v.object({
  id: v.string(),
  provider: v.literal("google"),
  placeId: v.string(),
  title: v.string(),
  subtitle: v.optional(v.string()),
});

export const vResolvedLocation = v.object({
  provider: v.literal("google"),
  googlePlaceId: v.string(),
  name: v.string(),
  formattedAddress: v.optional(v.string()),
});
