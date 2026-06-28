import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import type { UIPost } from "@acme/convex/posts/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { PostMediaPager } from "../media-pager/components/post-media-pager";
import { PostStore, usePostStore } from "../store";
import { PostActions } from "./post-actions";
import { PostCaption } from "./post-caption";
import { PostMoreButton } from "./post-more-button";

export function Post({ post }: { post: UIPost }) {
  return (
    <PostStore post={post}>
      <PostContent />
    </PostStore>
  );
}

export function PostContent() {
  const router = useRouter();
  const creator = usePostStore((store) => store.creator);

  return (
    <View className="gap-3">
      <ProfileStore profile={creator} key={creator.username}>
        <View className="mx-2 flex-row items-center gap-2">
          <Pressable
            onPress={() =>
              router.push(`/${encodeURIComponent(creator.username)}`)
            }
            className="min-w-0 flex-1 flex-row items-center gap-2"
          >
            <PFP variant="xs" />
            <View className="min-w-0 flex-1">
              <Name className="text-[15px] font-semibold" />
              <Username className="text-muted-foreground text-[13px]" />
            </View>
          </Pressable>
          <PostMoreButton />
        </View>
      </ProfileStore>
      <PostMediaPager />
      <PostCaption />
      <PostActions />
    </View>
  );
}
