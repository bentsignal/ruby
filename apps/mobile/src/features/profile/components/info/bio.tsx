import { Text } from "react-native";

import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Bio({ className }: { className?: string }) {
  const bio = useProfileStore((s) => s.bio);
  if (!bio) return null;
  return <Text className={cn("text-foreground", className)}>{bio}</Text>;
}
