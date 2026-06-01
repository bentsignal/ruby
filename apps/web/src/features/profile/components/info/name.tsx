import { useProfileStore } from "~/features/profile/store";
import { cn } from "~/utils/style-utils";

export function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return <span className={cn("text-foreground", className)}>{name}</span>;
}
