import { useProfileStore } from "~/features/profile/store";
import { cn } from "~/utils/style-utils";

export function Bio({ className }: { className?: string }) {
  const bio = useProfileStore((s) => s.bio);
  if (!bio) return null;
  return <span className={cn("", className)}>{bio}</span>;
}
