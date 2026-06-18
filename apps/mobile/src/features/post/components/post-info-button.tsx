import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Info } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { usePostStore } from "../store";

function optionalCoordinate(value?: number) {
  return typeof value === "number" ? String(value) : "";
}

export function PostInfoButton() {
  const createdAt = usePostStore((store) => store.createdAt);
  const location = usePostStore((store) => store.location);
  const mutedForeground = useColor("muted-foreground");
  const router = useRouter();

  function openDetails() {
    router.push({
      pathname: "/post-details",
      params: {
        createdAt: String(createdAt),
        formattedAddress: location?.formattedAddress ?? "",
        googlePlaceId: location?.googlePlaceId ?? "",
        latitude: optionalCoordinate(location?.latitude),
        locationName: location?.name ?? "",
        longitude: optionalCoordinate(location?.longitude),
      },
    });
  }

  return (
    <Pressable
      className="size-[22px] items-center justify-center"
      hitSlop={8}
      onPress={openDetails}
    >
      <Info color={mutedForeground} size={22} />
    </Pressable>
  );
}
