import type { LegendListRenderItemProps } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/types";

import { Post } from "./post";

function PostListItem({ item }: LegendListRenderItemProps<UIPost>) {
  return <Post post={item} />;
}

export function PostList({ posts }: { posts: UIPost[] }) {
  const inset = useSafeAreaInsets();
  return (
    <LegendList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: inset.bottom + 24 }}
      recycleItems={true}
    />
  );
}

function renderItem(props: LegendListRenderItemProps<UIPost>) {
  return <PostListItem {...props} />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}
