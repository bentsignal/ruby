import { Text } from "react-native";

import { usePostStore } from "../store";

export function PostDate() {
  const creationTime = usePostStore((store) => store.createdAt);

  return (
    <Text className="text-muted-foreground ml-auto text-xs">
      {new Date(creationTime).toLocaleDateString()}
    </Text>
  );
}
