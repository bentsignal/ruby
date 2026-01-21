import { Image, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Bookmark, Heart, MessageCircle, Share } from "lucide-react-native";

import type { UIPost } from "@acme/convex/types";

import * as Profile from "~/features/profile/atom";
import { useVar } from "~/hooks/use-color";

export const Post = ({ post }: { post: UIPost }) => {
  const foreground = useVar("foreground");
  return (
    <View className="mb-8 flex-col gap-2">
      <Profile.Store profile={post.creator}>
        <View className="mx-2 flex-row items-center gap-2">
          <Profile.ProfileImage className="mt-1" variant="post" />
          <Profile.ProfileInfo />
          <Text className="text-muted-foreground ml-auto text-xs">
            {new Date(post._creationTime).toLocaleDateString()}
          </Text>
        </View>
        <PagerView style={{ height: 200, width: "100%" }}>
          {post.images.map((image) => (
            <Image source={{ uri: image.url }} key={image.url} />
          ))}
        </PagerView>
      </Profile.Store>
      <View className="mx-2 flex-row items-center gap-6">
        <Heart className="size-4.5" color={foreground} />
        <MessageCircle className="size-3" color={foreground} />
        <Bookmark className="size-3" color={foreground} />
        <View className="flex-1 items-end">
          <Share className="size-3" color={foreground} />
        </View>
      </View>
      <Text className="text-card-foreground mx-2 text-sm">{post.caption}</Text>
    </View>
  );
};
