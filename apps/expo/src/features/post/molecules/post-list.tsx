import type { LegendListRenderItemProps } from "@legendapp/list";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { Id } from "@acme/convex/model";
import type { PostWithProfile } from "@acme/convex/types";

import { Post } from "./post";

const PostListItem = ({ item }: LegendListRenderItemProps<PostWithProfile>) => {
  return <Post post={item} />;
};

const PostList = ({ posts }: { posts: PostWithProfile[] }) => {
  const inset = useSafeAreaInsets();
  return (
    <LegendList
      data={posts}
      renderItem={PostListItem}
      keyExtractor={(item) => item._id}
      style={{ paddingTop: inset.top }}
      contentContainerClassName="flex-1"
      // ListEmptyComponent={<Skeletons />}
      recycleItems={true}
    />
  );
};

const Skeletons = () => {
  const emptyPosts = Array.from({ length: 10 }).map((_, index) => ({
    _id: index as unknown as Id<"posts">,
    _creationTime: 0,
    profileId: "" as Id<"profiles">,
    imageUrls: [],
    caption: "",
    profile: {
      _id: "" as Id<"profiles">,
      name: "",
      username: "",
      image: "",
    },
  }));
  return (
    <SafeAreaView>
      {emptyPosts.map((post) => (
        <Post post={post} key={post._id} />
      ))}
    </SafeAreaView>
  );
};

export { PostList, Skeletons };
