import type { Infer } from "convex/values";

import type { vProfile } from "./validators";

export type Profile = Infer<typeof vProfile>;
export type UIProfile = Omit<Profile, "userId" | "searchTerm">;
