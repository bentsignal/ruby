import { Image, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Play,
  Share,
} from "lucide-react-native";

import type { UIPost } from "@acme/convex/types";

import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";

export function Post({ post }: { post: UIPost }) {
  const foreground = useColor("foreground");
  const mediaItems = [
    ...post.files.map((file) => ({
      mediaType: file.mediaType,
      url: file.url,
    })),
    ...post.images.map((image) => ({
      mediaType: "image" as const,
      url: image.url,
    })),
  ];

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
        {mediaItems.length > 0 && (
          <PagerView style={{ height: 280, width: "100%" }}>
            {mediaItems.map((media) => (
              <View
                className="bg-muted items-center justify-center"
                collapsable={false}
                key={media.url}
                style={{ height: 280, width: "100%" }}
              >
                {media.mediaType === "video" ? (
                  <View className="items-center gap-2">
                    <Play className="size-8" color={foreground} />
                    <Text className="text-muted-foreground text-sm">
                      Video uploaded
                    </Text>
                  </View>
                ) : (
                  <Image
                    resizeMode="cover"
                    source={{ uri: media.url }}
                    style={{ height: 280, width: "100%" }}
                  />
                )}
              </View>
            ))}
          </PagerView>
        )}
      </ProfileStore>
      <View className="mx-2 flex-row items-center gap-6">
        <Heart className="size-4.5" color={foreground} />
        <MessageCircle className="size-3" color={foreground} />
        <Bookmark className="size-3" color={foreground} />
        <View className="flex-1 items-end">
          <Share className="size-3" color={foreground} />
        </View>
      </View>
      {!!post.caption && (
        <Text className="text-card-foreground mx-2 text-sm">
          {post.caption}
        </Text>
      )}
    </View>
  );
}
