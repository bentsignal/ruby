import type { Infer } from "convex/values";

import type { Id } from "./_generated/dataModel";
import type {
  vFile,
  vFriendshipStatus,
  vImage,
  vPost,
  vProfile,
} from "./validators";

type UIImage = Infer<typeof vImage>;
type UIFile = Omit<Infer<typeof vFile>, "uploadToken">;

type Profile = Infer<typeof vProfile>;
type UIProfile = Omit<Profile, "userId" | "searchTerm">;

type Post = Infer<typeof vPost>;
type UIPost = Omit<Post, "profileId" | "imagesIds"> & {
  _id: Id<"posts">;
  _creationTime: number;
  creator: UIProfile;
  files: UIFile[];
  images: UIImage[];
};

type FriendshipStatus = Infer<typeof vFriendshipStatus>;
type Relationship =
  | null
  | "friends"
  | "pending-incoming"
  | "pending-outgoing"
  | "my-profile";

export type {
  Post,
  UIPost,
  Profile,
  UIProfile,
  UIImage,
  UIFile,
  FriendshipStatus,
  Relationship,
};
