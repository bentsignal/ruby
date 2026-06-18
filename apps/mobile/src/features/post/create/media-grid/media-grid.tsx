import { ScrollView, View } from "react-native";

import { ImageViewerModal } from "../image-viewer/image-viewer-modal";
import { MediaTile } from "./components/tile";
import { MediaGridStore, useMediaGridStore } from "./store";

export function MediaGrid() {
  return (
    <MediaGridStore>
      <MediaGridContent />
    </MediaGridStore>
  );
}

function MediaGridContent() {
  const items = useMediaGridStore((store) => store.items);

  if (items.length === 0) return null;

  return (
    <View>
      <ScrollView
        horizontal
        className="-mx-4"
        contentContainerClassName="gap-3 px-6"
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => {
          return <MediaTile index={index} itemId={item.id} key={item.id} />;
        })}
      </ScrollView>

      <ImagePreviewModalHost />
    </View>
  );
}

function ImagePreviewModalHost() {
  const closePreview = useMediaGridStore((store) => store.closePreview);
  const imageItems = useMediaGridStore((store) => store.imageItems);
  const previewIndex = useMediaGridStore((store) => store.previewIndex);

  if (previewIndex === null) {
    return null;
  }

  return (
    <ImageViewerModal
      initialIndex={previewIndex}
      isVisible
      items={imageItems}
      onClose={closePreview}
    />
  );
}
