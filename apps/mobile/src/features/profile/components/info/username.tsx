import { Text } from "react-native";

import { useProfileStore } from "~/features/profile/store";
import { cn } from "~/utils/style-utils";

export function Username({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <Text className={cn("text-muted-foreground", className)}>@{username}</Text>
  );
}
