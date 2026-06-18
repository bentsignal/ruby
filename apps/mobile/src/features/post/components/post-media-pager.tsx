import { Animated, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

import { MediaPagerStore, useMediaPagerStore } from "./media-pager/store";
import { MediaViewerModal } from "./media-viewer/media-viewer-modal";
import { PostMediaItem } from "./post-media-item";

export function PostMediaPager() {
  return (
    <MediaPagerStore>
      <PostMediaPagerContent />
    </MediaPagerStore>
  );
}

function PostMediaPagerContent() {
  const closeViewer = useMediaPagerStore((store) => store.closeViewer);
  const height = useMediaPagerStore((store) => store.height);
  const mediaItems = useMediaPagerStore((store) => store.mediaItems);
  const openViewer = useMediaPagerStore((store) => store.openViewer);
  const selectPage = useMediaPagerStore((store) => store.selectPage);
  const setPageIsScrolling = useMediaPagerStore(
    (store) => store.setPageIsScrolling,
  );
  const viewerIndex = useMediaPagerStore((store) => store.viewerIndex);
  const width = useMediaPagerStore((store) => store.width);

  if (mediaItems.length === 0) return null;

  return (
    <View>
      <View className="bg-muted overflow-hidden" style={{ height, width }}>
        <PagerView
          style={{ flex: 1 }}
          onPageScrollStateChanged={(event) =>
            setPageIsScrolling(event.nativeEvent.pageScrollState !== "idle")
          }
          onPageSelected={(event) => selectPage(event.nativeEvent.position)}
        >
          {mediaItems.map((media, index) => (
            <PostMediaItem
              key={`${media.url}-${index}`}
              media={media}
              onPinchOpen={() => openViewer(index)}
            />
          ))}
        </PagerView>

        <MediaOverlayHost />
      </View>

      <MediaViewerModal
        initialIndex={viewerIndex ?? 0}
        isVisible={viewerIndex !== null}
        items={mediaItems}
        onClose={closeViewer}
      />
    </View>
  );
}

function MediaOverlayHost() {
  const activeIndex = useMediaPagerStore((store) => store.activeIndex);
  const mediaItems = useMediaPagerStore((store) => store.mediaItems);

  if (mediaItems.length <= 1) return null;

  return <MediaOverlay activeIndex={activeIndex} total={mediaItems.length} />;
}

function MediaOverlay({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  const opacity = useMediaPagerStore((store) => store.overlayOpacity);

  return (
    <Animated.View
      className="absolute top-3 right-3"
      pointerEvents="none"
      style={{ opacity }}
    >
      <View className="rounded-full bg-black/55 px-2.5 py-1">
        <Text className="text-xs font-bold text-white">
          {activeIndex + 1} / {total}
        </Text>
      </View>
    </Animated.View>
  );
}
