import type { Infer } from "convex/values";

import type { vFriendshipStatus } from "./validators";

export type FriendshipStatus = Infer<typeof vFriendshipStatus>;
export type Relationship =
  | null
  | "friends"
  | "pending-incoming"
  | "pending-outgoing"
  | "my-profile";
