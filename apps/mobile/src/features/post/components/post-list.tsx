import type { LegendListRenderItemProps } from "@legendapp/list";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/types";

import roundedIcon from "../../../../assets/rounded-icon.png";
import { Post } from "./post";

function PostListItem({ item }: LegendListRenderItemProps<UIPost>) {
  return <Post post={item} />;
}

export function PostList({
  posts,
  topInset = true,
}: {
  posts: UIPost[];
  topInset?: boolean;
}) {
  const inset = useSafeAreaInsets();
  return (
    <LegendList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{ flex: 1 }}
      ListHeaderComponent={
        <PostListHeader topPadding={topInset ? inset.top : 0} />
      }
      contentContainerStyle={{
        paddingBottom: inset.bottom + 24,
      }}
      recycleItems={true}
    />
  );
}

function PostListHeader({ topPadding }: { topPadding: number }) {
  return (
    <View className="items-center pb-6" style={{ paddingTop: topPadding }}>
      <Image
        accessibilityLabel="Ruby"
        source={roundedIcon}
        style={{ borderRadius: 24, height: 48, width: 48 }}
      />
    </View>
  );
}

function renderItem(props: LegendListRenderItemProps<UIPost>) {
  return <PostListItem {...props} />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}
