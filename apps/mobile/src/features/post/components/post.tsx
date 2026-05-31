import { Image, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Bookmark, Heart, MessageCircle, Share } from "lucide-react-native";

import type { UIPost } from "@acme/convex/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";

export function Post({ post }: { post: UIPost }) {
  const foreground = useColor("foreground");
  return (
    <View className="mb-8 flex-col gap-2">
      <ProfileStore profile={post.creator}>
        <View className="mx-2 flex-row items-center gap-2">
          <PFP variant="sm" />
          <View>
            <Name className="text-base" />
            <Username className="text-foreground text-xs" />
          </View>
          <Text className="text-muted-foreground ml-auto text-xs">
            {new Date(post._creationTime).toLocaleDateString()}
          </Text>
        </View>
        <PagerView style={{ height: 200, width: "100%" }}>
          {post.images.map((image) => (
            <Image source={{ uri: image.url }} key={image.url} />
          ))}
        </PagerView>
      </ProfileStore>
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
}
