import { Modal, View } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gallery } from "react-native-zoom-toolkit";

import type { PostMediaItem } from "../../store";
import { MediaViewerStore, useMediaViewerStore } from "../store";
import { CloseButton, ThumbnailStrip, ViewerCounter } from "./controls";
import { ViewerPage } from "./page";

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
  const closeRequested = useSharedValue(false);
  const isZoomed = useSharedValue(false);
  const galleryRef = useMediaViewerStore((store) => store.galleryRef);
  const handleZoomChange = useMediaViewerStore(
    (store) => store.handleZoomChange,
  );
  const initialIndex = useMediaViewerStore((store) => store.initialIndex);
  const items = useMediaViewerStore((store) => store.items);
  const onClose = useMediaViewerStore((store) => store.onClose);
  const selectImage = useMediaViewerStore((store) => store.selectImage);
  const toggleControls = useMediaViewerStore((store) => store.toggleControls);

  return (
    <View className="flex-1 bg-black">
      <Gallery
        ref={galleryRef}
        data={items}
        gap={12}
        initialIndex={initialIndex}
        keyExtractor={(media, index) => `${media.url}-${index}`}
        maxScale={4}
        renderItem={(media) => <ViewerPage media={media} />}
        tapOnEdgeToItem={false}
        onIndexChange={selectImage}
        onTap={toggleControls}
        onUpdate={({ scale }) => {
          "worklet";

          const nextIsZoomed = scale > 1.01;
          if (nextIsZoomed === isZoomed.value) return;

          isZoomed.value = nextIsZoomed;
          runOnJS(handleZoomChange)(nextIsZoomed);
        }}
        onVerticalPull={({ released, translateY, velocityY }) => {
          "worklet";

          if (!released) {
            closeRequested.value = false;
            return;
          }

          const shouldClose =
            translateY > 110 || (translateY > 36 && velocityY > 900);

          if (!shouldClose || closeRequested.value) return;

          closeRequested.value = true;
          scheduleOnRN(onClose);
        }}
      />

      <ViewerCounter />
      <CloseButton />
      <ThumbnailStrip />
    </View>
  );
}
