import { Text } from "react-native";

import { useProfileStore } from "~/features/profile/store";
import { cn } from "~/utils/style-utils";

export function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return (
    <Text className={cn("text-foreground text-lg font-bold", className)}>
      {name}
    </Text>
  );
}
