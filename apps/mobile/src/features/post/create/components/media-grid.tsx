import { useState } from "react";
import { ScrollView, View } from "react-native";

import { isPreviewableImage } from "../lib/media-type";
import { useCreateStore } from "../store";
import { ImageViewerModal } from "./image-viewer-modal";
import { MediaTile } from "./media-tile";

export function MediaGrid() {
  const items = useCreateStore((store) => store.items);
  const imageItems = items.filter(isPreviewableImage);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

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
          const imageIndex = imageItems.findIndex(
            (current) => current.id === item.id,
          );

          return (
            <MediaTile
              index={index}
              itemId={item.id}
              key={item.id}
              onImagePress={
                imageIndex === -1
                  ? undefined
                  : () => setPreviewIndex(imageIndex)
              }
            />
          );
        })}
      </ScrollView>

      {previewIndex !== null ? (
        <ImageViewerModal
          initialIndex={previewIndex}
          isVisible
          items={imageItems}
          onClose={() => setPreviewIndex(null)}
        />
      ) : null}
    </View>
  );
}
