import { Heart, MessageCircle } from "lucide-react";

import { PostMoreButton } from "./post-more-button";

export function PostActions() {
  return (
    <div className="text-muted-foreground -mx-2 -mt-2 flex items-center gap-1">
      <ActionButton label="Like">
        <Heart className="size-5" />
      </ActionButton>
      <ActionButton label="Comment">
        <MessageCircle className="size-5" />
      </ActionButton>
      <div className="flex-1" />
      <PostMoreButton />
    </div>
  );
}

function ActionButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="hover:text-primary focus-visible:text-primary flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95"
      type="button"
    >
      {children}
    </button>
  );
}
