import type { Infer } from "convex/values";

import type { Id } from "../_generated/dataModel";
import type { UIFile } from "../files/types";
import type { UIProfile } from "../profile/types";
import type { vPost, vPostLocation } from "./validators";

export type Post = Infer<typeof vPost>;
export type PostLocation = Infer<typeof vPostLocation>;
export type UIPost = Omit<Post, "profileId"> & {
  _id: Id<"posts">;
  _creationTime: number;
  creator: UIProfile;
  files: UIFile[];
  likedByMe: boolean;
};
