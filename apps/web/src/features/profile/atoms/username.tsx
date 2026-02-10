import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function Username({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <span className={cn("text-muted-foreground", className)}>@{username}</span>
  );
}

export { Username };
