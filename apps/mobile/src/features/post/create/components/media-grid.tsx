import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";

import { useCreateStore } from "../store";
import { MediaTile } from "./media-tile";

export function MediaGrid() {
  const handleGridLayout = useCreateStore((store) => store.handleGridLayout);
  const items = useCreateStore((store) => store.items);

  if (items.length === 0) return null;

  return (
    <View
      className="-mx-1.5 flex-row flex-wrap"
      onLayout={(event: LayoutChangeEvent) => handleGridLayout(event)}
    >
      {items.map((item, index) => (
        <MediaTile index={index} itemId={item.id} key={item.id} />
      ))}
    </View>
  );
}
