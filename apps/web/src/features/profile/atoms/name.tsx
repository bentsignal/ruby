import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return <span className={cn("text-foreground", className)}>{name}</span>;
}

export { Name };
