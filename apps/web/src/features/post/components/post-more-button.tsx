import { MoreHorizontal } from "lucide-react";

export function PostMoreButton() {
  return (
    <button
      aria-label="Post options"
      className="text-muted-foreground hover:text-primary focus-visible:text-primary grid size-9 cursor-pointer place-items-center rounded-full transition-colors active:scale-95"
      type="button"
    >
      <MoreHorizontal className="size-5" />
    </button>
  );
}
