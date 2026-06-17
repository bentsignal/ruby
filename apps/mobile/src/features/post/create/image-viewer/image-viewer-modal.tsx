import { Modal, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import type { ComposerItem } from "../types";
import {
  CloseButton,
  ThumbnailStrip,
  ViewerCounter,
} from "./components/controls";
import { ViewerPage } from "./components/page";
import { ImageViewerStore, useImageViewerStore } from "./store";

export function ImageViewerModal({
  initialIndex,
  isVisible,
  items,
  onClose,
}: {
  initialIndex: number;
  isVisible: boolean;
  items: ComposerItem[];
  onClose: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ImageViewerStore
        initialIndex={initialIndex}
        items={items}
        onClose={onClose}
      >
        <ImageViewerContent />
      </ImageViewerStore>
    </Modal>
  );
}

function ImageViewerContent() {
  const dismissGesture = useImageViewerStore((store) => store.dismissGesture);
  const initialIndex = useImageViewerStore((store) => store.initialIndex);
  const items = useImageViewerStore((store) => store.items);
  const pagerRef = useImageViewerStore((store) => store.pagerRef);
  const selectImage = useImageViewerStore((store) => store.selectImage);

  return (
    <View className="flex-1 bg-black">
      <GestureDetector gesture={dismissGesture}>
        <PagerView
          ref={pagerRef}
          initialPage={initialIndex}
          overdrag
          style={{ flex: 1 }}
          onPageSelected={(event) => selectImage(event.nativeEvent.position)}
        >
          {items.map((item) => (
            <ViewerPage item={item} key={item.id} />
          ))}
        </PagerView>
      </GestureDetector>

      <ViewerCounter />
      <CloseButton />
      <ThumbnailStrip />
    </View>
  );
}
