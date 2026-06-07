import { View } from "react-native";

import type { UIPost } from "@acme/convex/posts/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { PostStore } from "../store";
import { PostActions } from "./post-actions";
import { PostCaption } from "./post-caption";
import { PostDate } from "./post-date";
import { PostMediaPager } from "./post-media-pager";

export function Post({ post }: { post: UIPost }) {
  return (
    <PostStore post={post}>
      <View className="mb-8 flex-col gap-2">
        <ProfileStore profile={post.creator}>
          <View className="mx-2 flex-row items-center gap-2">
            <PFP variant="sm" />
            <View>
              <Name className="text-base" />
              <Username className="text-foreground text-xs" />
            </View>
            <PostDate />
          </View>
        </ProfileStore>
        <PostMediaPager />
        <PostActions />
        <PostCaption />
      </View>
    </PostStore>
  );
}
