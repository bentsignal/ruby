import { usePostStore } from "../store";
import { PostMediaCarousel } from "./media/carousel";
import { PostMediaLightbox } from "./media/lightbox";
import { MediaStore } from "./media/store";

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
