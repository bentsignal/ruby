import { Text } from "react-native";

import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return (
    <Text className={cn("text-foreground text-lg font-bold", className)}>
      {name}
    </Text>
  );
}
