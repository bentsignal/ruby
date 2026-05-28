import type { LegendListRenderItemProps } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/types";

import { Post } from "./post";

function PostListItem({ item }: LegendListRenderItemProps<UIPost>) {
  return <Post post={item} />;
}

function PostList({ posts }: { posts: UIPost[] }) {
  const inset = useSafeAreaInsets();
  return (
    <LegendList
      data={posts}
      renderItem={PostListItem}
      keyExtractor={(item) => item._id}
      style={{ paddingTop: inset.top }}
      contentContainerClassName="flex-1"
      recycleItems={true}
    />
  );
}

export { PostList };
