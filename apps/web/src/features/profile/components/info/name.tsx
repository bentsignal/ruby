import { cn } from "@acme/std/cn";

import { useProfileStore } from "~/features/profile/store";

export function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return <span className={cn("text-foreground", className)}>{name}</span>;
}
