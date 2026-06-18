import { Modal, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import type { PostMediaItem } from "../../store";
import { CloseButton, ThumbnailStrip, ViewerCounter } from "./controls";
import { ViewerPage } from "./page";
import { MediaViewerStore, useMediaViewerStore } from "./store";

export function MediaViewerModal({
  initialIndex,
  isVisible,
  items,
  onClose,
}: {
  initialIndex: number;
  isVisible: boolean;
  items: PostMediaItem[];
  onClose: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <MediaViewerStore
        initialIndex={initialIndex}
        items={items}
        onClose={onClose}
      >
        <MediaViewerContent />
      </MediaViewerStore>
    </Modal>
  );
}

function MediaViewerContent() {
  const dismissGesture = useMediaViewerStore((store) => store.dismissGesture);
  const initialIndex = useMediaViewerStore((store) => store.initialIndex);
  const isZoomed = useMediaViewerStore((store) => store.isZoomed);
  const items = useMediaViewerStore((store) => store.items);
  const pagerRef = useMediaViewerStore((store) => store.pagerRef);
  const selectImage = useMediaViewerStore((store) => store.selectImage);

  return (
    <View className="flex-1 bg-black">
      <GestureDetector gesture={dismissGesture}>
        <PagerView
          ref={pagerRef}
          initialPage={initialIndex}
          scrollEnabled={!isZoomed}
          style={{ flex: 1 }}
          onPageSelected={(event) => selectImage(event.nativeEvent.position)}
        >
          {items.map((media, index) => (
            <ViewerPage key={`${media.url}-${index}`} media={media} />
          ))}
        </PagerView>
      </GestureDetector>

      <ViewerCounter />
      <CloseButton />
      <ThumbnailStrip />
    </View>
  );
}
