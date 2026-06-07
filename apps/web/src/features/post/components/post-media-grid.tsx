import { usePostStore } from "../store";
import { PostMediaItem } from "./post-media-item";

export function PostMediaGrid() {
  const mediaItems = usePostStore((store) => store.mediaItems);

  if (mediaItems.length === 0) return null;

  return (
    <div className="grid gap-2">
      {mediaItems.map((media, index) => (
        <PostMediaItem key={`${media.url}-${index}`} media={media} />
      ))}
    </div>
  );
}
