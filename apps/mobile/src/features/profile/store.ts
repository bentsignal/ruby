import { createStore } from "rostra";

import type { Relationship } from "@acme/convex/friends/types";
import type { UIProfile } from "@acme/convex/profile/types";

interface StoreProps {
  profile: UIProfile;
  relationship?: Relationship;
}

function useInternalStore({ profile, relationship }: StoreProps) {
  const { name, image, username, bio, link } = profile;
  return { name, image, username, bio, link, relationship };
}

export const { Store: ProfileStore, useStore: useProfileStore } =
  createStore(useInternalStore);
