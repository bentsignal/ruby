import { usePostStore } from "../../store";
import { MediaStore } from "../store";
import { PostMediaCarousel } from "./carousel";
import { PostMediaLightbox } from "./lightbox";

export function PostMedia() {
  const mediaItems = usePostStore((store) => store.mediaItems);

  if (mediaItems.length === 0) return null;

  return (
    <MediaStore mediaItems={mediaItems}>
      <PostMediaCarousel />
      <PostMediaLightbox />
    </MediaStore>
  );
}
