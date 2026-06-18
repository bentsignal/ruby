import type { Doc } from "../_generated/dataModel";
import type { UIProfile } from "./types";

export const DeletedProfile = {
  username: "deleted_user",
  name: "Deleted User",
  image: undefined,
} satisfies UIProfile;

export function getPublicProfile(profile: Doc<"profiles">) {
  return {
    name: profile.name,
    username: profile.username,
    image: profile.image,
    bio: profile.bio,
    link: profile.link,
  };
}
