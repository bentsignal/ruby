import { usePostStore } from "../../store";
import { PostMediaLightbox } from "../lightbox";
import { MediaStore } from "../store";
import { PostMediaCarousel } from "./carousel";

export function PostMedia() {
  const displayAspectRatio = usePostStore((store) => store.displayAspectRatio);
  const mediaItems = usePostStore((store) => store.mediaItems);

  if (mediaItems.length === 0) return null;

  return (
    <MediaStore displayAspectRatio={displayAspectRatio} mediaItems={mediaItems}>
      <PostMediaCarousel />
      <PostMediaLightbox />
    </MediaStore>
  );
}
