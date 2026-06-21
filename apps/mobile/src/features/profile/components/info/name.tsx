import type { ComponentProps } from "react";
import { Text } from "react-native";

import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Name({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return (
    <Text
      className={cn("text-foreground text-lg font-bold", className)}
      {...props}
    >
      {name}
    </Text>
  );
}
