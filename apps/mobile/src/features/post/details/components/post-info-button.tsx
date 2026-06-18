import { Pressable } from "react-native";
import { Info } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { useOpenPostDetails } from "../hooks/use-open-post-details";

export function PostInfoButton() {
  const mutedForeground = useColor("muted-foreground");
  const openDetails = useOpenPostDetails();

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
