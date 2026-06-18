import type { Infer } from "convex/values";

import type { vLocationPrediction, vResolvedLocation } from "./validators";

export type LocationPrediction = Infer<typeof vLocationPrediction>;
export type ResolvedLocation = Infer<typeof vResolvedLocation>;
