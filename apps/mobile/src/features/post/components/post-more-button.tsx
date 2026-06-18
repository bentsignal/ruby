import { Pressable } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";

export function PostMoreButton() {
  const mutedForeground = useColor("muted-foreground");

  return (
    <Pressable
      accessibilityLabel="Post options"
      accessibilityRole="button"
      className="size-[22px] items-center justify-center"
      hitSlop={8}
    >
      <MoreHorizontal color={mutedForeground} size={22} />
    </Pressable>
  );
}
