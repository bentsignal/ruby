import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Username({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <span className={cn("text-muted-foreground", className)}>@{username}</span>
  );
}
