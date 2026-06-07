import type { Infer } from "convex/values";

import type { Id } from "../_generated/dataModel";
import type { UIFile } from "../files/types";
import type { UIImage } from "../images/types";
import type { UIProfile } from "../profile/types";
import type { vPost } from "./validators";

export type Post = Infer<typeof vPost>;
export type UIPost = Omit<Post, "profileId" | "imagesIds"> & {
  _id: Id<"posts">;
  _creationTime: number;
  creator: UIProfile;
  files: UIFile[];
  images: UIImage[];
};
