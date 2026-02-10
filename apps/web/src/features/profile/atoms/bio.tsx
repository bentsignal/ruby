import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function Bio({ className }: { className?: string }) {
  const bio = useProfileStore((s) => s.bio);
  if (!bio) return null;
  return <span className={cn("", className)}>{bio}</span>;
}

export { Bio };
