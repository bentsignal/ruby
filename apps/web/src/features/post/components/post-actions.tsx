import { Heart, MessageCircle } from "lucide-react";

import { usePostStore } from "../store";
import { PostMoreButton } from "./post-more-button";

export function PostActions() {
  const likedByMe = usePostStore((store) => store.likedByMe);
  const toggleLike = usePostStore((store) => store.toggleLike);

  return (
    <div className="text-muted-foreground -mx-2 -mt-2 flex items-center gap-1">
      <ActionButton label="Like" onClick={toggleLike}>
        <Heart
          className={likedByMe ? "text-primary fill-primary size-5" : "size-5"}
        />
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
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="hover:text-primary focus-visible:text-primary flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
