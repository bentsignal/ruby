import { useProfileStore } from "~/features/profile/store";
import { cn } from "~/utils/style-utils";

export function Username({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <span className={cn("text-muted-foreground", className)}>@{username}</span>
  );
}
