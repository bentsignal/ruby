import { useEffect, useState } from "react";
import { Animated, Image, Text, useWindowDimensions, View } from "react-native";
import PagerView from "react-native-pager-view";

import { usePostStore } from "../store";
import { MediaViewerModal } from "./media-viewer/media-viewer-modal";
import { PostMediaItem } from "./post-media-item";

const MIN_ASPECT_RATIO = 4 / 5;
const MAX_ASPECT_RATIO = 1.91;
const DEFAULT_ASPECT_RATIO = 4 / 5;

function clampAspectRatio(ratio: number) {
  if (!Number.isFinite(ratio) || ratio <= 0) return DEFAULT_ASPECT_RATIO;
  return Math.min(MAX_ASPECT_RATIO, Math.max(MIN_ASPECT_RATIO, ratio));
}

export function PostMediaPager() {
  const mediaItems = usePostStore((store) => store.mediaItems);
  const { width } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const firstImage = mediaItems.find((media) => media.mediaType === "image");
  const firstImageUrl = firstImage?.url;

  // Every slide is cropped to the first image's aspect ratio, so we only need
  // to measure that one image to size the whole pager.
  // eslint-disable-next-line no-restricted-syntax -- syncing with remote image dimensions
  useEffect(() => {
    if (!firstImageUrl) return;
    let active = true;
    Image.getSize(
      firstImageUrl,
      (imageWidth, imageHeight) => {
        if (!active) return;
        setAspectRatio(clampAspectRatio(imageWidth / imageHeight));
      },
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, [firstImageUrl]);

  if (mediaItems.length === 0) return null;

  const height = Math.round(width / (aspectRatio ?? DEFAULT_ASPECT_RATIO));
  const isMulti = mediaItems.length > 1;

  return (
    <View>
      <View className="bg-muted overflow-hidden" style={{ height, width }}>
        <PagerView
          style={{ flex: 1 }}
          onPageScrollStateChanged={(event) =>
            setIsScrolling(event.nativeEvent.pageScrollState !== "idle")
          }
          onPageSelected={(event) => setActiveIndex(event.nativeEvent.position)}
        >
          {mediaItems.map((media, index) => (
            <PostMediaItem
              key={media.url}
              media={media}
              onPinchOpen={() => setViewerIndex(index)}
            />
          ))}
        </PagerView>

        {isMulti && (
          <MediaOverlay
            activeIndex={activeIndex}
            isScrolling={isScrolling}
            total={mediaItems.length}
          />
        )}
      </View>

      <MediaViewerModal
        initialIndex={viewerIndex ?? 0}
        isVisible={viewerIndex !== null}
        items={mediaItems}
        onClose={() => setViewerIndex(null)}
      />
    </View>
  );
}

function MediaOverlay({
  activeIndex,
  isScrolling,
  total,
}: {
  activeIndex: number;
  isScrolling: boolean;
  total: number;
}) {
  const [opacity] = useState(() => new Animated.Value(1));

  // Reveal the counter the instant a swipe begins, then fade it once the pager
  // settles so the image can be viewed unobstructed; this drives an imperative
  // animation timeline that must sync with the gesture state.
  // eslint-disable-next-line no-restricted-syntax -- imperative animation sequence
  useEffect(() => {
    opacity.stopAnimation();
    if (isScrolling) {
      opacity.setValue(1);
      return;
    }
    const animation = Animated.sequence([
      Animated.delay(5_000),
      Animated.timing(opacity, {
        duration: 400,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [activeIndex, isScrolling, opacity]);

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
