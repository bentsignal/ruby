import type { Infer } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { vPost, vProfile } from "./validators";

type Profile = Infer<typeof vProfile>;
type PublicProfile = Omit<Profile, "_creationTime" | "userId"> & {
  _id: Id<"profiles">;
};

type Post = Infer<typeof vPost>;
type PostWithProfile = Post & {
  _id: Id<"posts">;
  _creationTime: number;
  profile: PublicProfile;
};

export type { Post, PostWithProfile, Profile, PublicProfile };
