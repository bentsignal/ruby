import type { Doc } from "../_generated/dataModel";
import type { UIProfile } from "./types";

export const DeletedProfile = {
  username: "deleted_user",
  name: "Deleted User",
  image: undefined,
} satisfies UIProfile;

export function getPublicProfile(profile: Doc<"profiles">) {
  const { userId: _userId, _creationTime, _id, ...publicProfile } = profile;
  return publicProfile;
}
