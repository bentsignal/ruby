import { View } from "react-native";

import { useCreateStore } from "../store";
import { MediaTile } from "./media-tile";
import { ReorderMediaButton } from "./reorder-media-button";

export function MediaGrid() {
  const items = useCreateStore((store) => store.items);

  if (items.length === 0) return null;

  return (
    <View className="gap-3">
      <View className="-mx-1.5 flex-row flex-wrap">
        {items.map((item, index) => (
          <MediaTile index={index} itemId={item.id} key={item.id} />
        ))}
      </View>
      <ReorderMediaButton />
    </View>
  );
}
