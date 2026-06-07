import PagerView from "react-native-pager-view";

import { usePostStore } from "../store";
import { PostMediaItem } from "./post-media-item";

export function PostMediaPager() {
  const mediaItems = usePostStore((store) => store.mediaItems);

  if (mediaItems.length === 0) return null;

  return (
    <PagerView style={{ height: 280, width: "100%" }}>
      {mediaItems.map((media) => (
        <PostMediaItem key={media.url} media={media} />
      ))}
    </PagerView>
  );
}
