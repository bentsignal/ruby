import { View } from "react-native";

import type { UIPost } from "@acme/convex/posts/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { PostStore } from "../store";
import { PostActions } from "./post-actions";
import { PostCaption } from "./post-caption";
import { PostInfoButton } from "./post-info-button";
import { PostMediaPager } from "./post-media-pager";

export function Post({ post }: { post: UIPost }) {
  return (
    <PostStore post={post}>
      <View className="gap-3">
        <ProfileStore profile={post.creator}>
          <View className="mx-2 flex-row items-center gap-2">
            <PFP variant="xs" />
            <View className="flex-1">
              <Name className="text-[15px] font-semibold" />
              <Username className="text-muted-foreground text-[13px]" />
            </View>
            <PostInfoButton />
          </View>
        </ProfileStore>
        <PostMediaPager />
        <PostCaption />
        <PostActions />
      </View>
    </PostStore>
  );
}
