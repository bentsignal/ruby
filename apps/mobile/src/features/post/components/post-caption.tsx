import { Text } from "react-native";

import { usePostStore } from "../store";

export function PostCaption() {
  const caption = usePostStore((store) => store.caption);

  if (!caption) return null;

  return (
    <Text className="text-card-foreground mx-2 text-sm leading-5">
      {caption}
    </Text>
  );
}
