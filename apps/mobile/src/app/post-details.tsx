import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CalendarDays, MapPin } from "lucide-react-native";

import type { PostDetailsSearchParams } from "~/features/post/details/params";
import { SafeAreaView } from "~/components/safe-area-view";
import { normalizePostDetailsParams } from "~/features/post/details/params";
import {
  PostDetailsStore,
  usePostDetailsStore,
} from "~/features/post/details/store";
import { useColor } from "~/hooks/use-color";

export default function PostDetails() {
  const params = useLocalSearchParams<PostDetailsSearchParams>();

  return (
    <PostDetailsStore params={normalizePostDetailsParams(params)}>
      <PostDetailsContent />
    </PostDetailsStore>
  );
}

function PostDetailsContent() {
  const formattedDate = usePostDetailsStore((store) => store.formattedDate);
  const mutedForeground = useColor("muted-foreground");

  return (
    <SafeAreaView top={false}>
      <View className="gap-5 px-6 pt-7">
        <Text className="text-foreground text-lg font-bold">Details</Text>

        <View className="gap-3">
          <View className="flex-row items-center gap-3 py-1">
            <CalendarDays color={mutedForeground} size={20} />
            <Text className="text-foreground flex-1 text-[15px] leading-5">
              {formattedDate}
            </Text>
          </View>

          <PostLocationDetail />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PostLocationDetail() {
  const locationLabel = usePostDetailsStore((store) => store.locationLabel);
  const openInMaps = usePostDetailsStore((store) => store.openInMaps);
  const secondary = useColor("secondary");

  if (!locationLabel) return null;

  return (
    <Pressable
      className="flex-row items-center gap-3 py-1"
      onPress={openInMaps}
    >
      <MapPin color={secondary} size={20} />
      <Text className="text-secondary flex-1 text-[15px] leading-5 font-semibold">
        {locationLabel}
      </Text>
    </Pressable>
  );
}
