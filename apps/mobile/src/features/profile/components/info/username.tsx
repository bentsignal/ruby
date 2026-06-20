import type { ComponentProps } from "react";
import { Text } from "react-native";

import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Username({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <Text className={cn("text-muted-foreground", className)} {...props}>
      @{username}
    </Text>
  );
}
