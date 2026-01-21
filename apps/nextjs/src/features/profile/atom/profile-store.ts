import { createStore } from "rostra";

import type { UIProfile } from "@acme/convex/types";

interface StoreProps {
  profile: UIProfile;
}

function useInternalStore({ profile }: StoreProps) {
  const { name, image, username } = profile;
  return { name, image, username };
}

export const { Store, useStore } = createStore(useInternalStore);
