import { useLocalSearchParams } from "expo-router";

import type { PostDetailsSearchParams } from "~/features/post/details/lib/params";
import { PostDetailsContent } from "~/features/post/details/components/post-details-content";
import { normalizePostDetailsParams } from "~/features/post/details/lib/params";
import { PostDetailsStore } from "~/features/post/details/store";

export default function PostDetails() {
  const params = useLocalSearchParams<PostDetailsSearchParams>();

  return (
    <PostDetailsStore params={normalizePostDetailsParams(params)}>
      <PostDetailsContent />
    </PostDetailsStore>
  );
}
