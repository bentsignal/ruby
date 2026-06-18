import { useRouter } from "expo-router";

import { usePostStore } from "../store";
import { createPostDetailsParams } from "./params";

export function useOpenPostDetails() {
  const createdAt = usePostStore((store) => store.createdAt);
  const location = usePostStore((store) => store.location);
  const router = useRouter();

  return () => {
    router.push({
      pathname: "/post-details",
      params: createPostDetailsParams({ createdAt, location }),
    });
  };
}
