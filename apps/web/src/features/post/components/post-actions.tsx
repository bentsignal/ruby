import { Bookmark, Heart, MessageCircle, Share } from "lucide-react";

export function PostActions() {
  return (
    <div className="flex items-center gap-6">
      <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
        <Heart className="h-5 w-5" />
      </button>
      <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
        <MessageCircle className="h-5 w-5" />
      </button>
      <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
        <Bookmark className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <button className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2">
        <Share className="h-5 w-5" />
      </button>
    </div>
  );
}
