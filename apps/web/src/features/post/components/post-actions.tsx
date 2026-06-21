import { Bookmark, Heart, MessageCircle } from "lucide-react";

import { PostInfoButton } from "../details/components/post-info-button";
import { usePostStore } from "../store";

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
      <CommentButton>
        <MessageCircle className="size-5" />
        <span>Open comments</span>
      </CommentButton>
      <div className="flex-1" />
      <PostInfoButton />
      <ActionButton label="Bookmark">
        <Bookmark className="size-5" />
      </ActionButton>
    </div>
  );
}

function CommentButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      aria-label="Comment"
      className="hover:text-primary focus-visible:text-primary flex h-9 cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-medium transition-colors active:scale-95"
      type="button"
    >
      {children}
    </button>
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
