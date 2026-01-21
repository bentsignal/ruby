import type { Infer } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type { vImage, vPost, vProfile } from "./validators";

type UIImage = Infer<typeof vImage>;

type Profile = Infer<typeof vProfile>;
type UIProfile = Omit<Profile, "userId">;

type Post = Infer<typeof vPost>;
type UIPost = Omit<Post, "profileId" | "imagesIds"> & {
  _id: Id<"posts">;
  _creationTime: number;
  creator: UIProfile;
  images: UIImage[];
};

export type { Post, UIPost, Profile, UIProfile, UIImage };
