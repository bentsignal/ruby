import type { LegendListRenderItemProps } from "@legendapp/list";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// eslint-disable-next-line no-restricted-imports -- Expo Router tab screens fetch after auth context is mounted.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { LegendList } from "@legendapp/list";

import type { UIPost } from "@acme/convex/types";
import { api } from "@acme/convex/api";

import { Post } from "~/features/post/components/post";
import roundedIcon from "../../../../assets/rounded-icon.png";

export default function Home() {
  const { data } = useQuery({
    ...convexQuery(api.posts.getAll, {}),
    select: (posts) => posts,
  });

  const posts = data ?? [];

  const inset = useSafeAreaInsets();

  return (
    <LegendList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{ flex: 1 }}
      ListHeaderComponent={<ListHeader topPadding={inset.top} />}
      contentContainerStyle={{
        paddingBottom: inset.bottom + 24,
      }}
      recycleItems={true}
    />
  );
}

function ListHeader({ topPadding }: { topPadding: number }) {
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
  return <Post post={props.item} />;
}

function keyExtractor(post: UIPost) {
  return post._id;
}
