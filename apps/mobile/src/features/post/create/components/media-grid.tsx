import { ScrollView, View } from "react-native";

import { useCreateStore } from "../store";
import { MediaTile } from "./media-tile";
import { ManageMediaButton } from "./reorder-media-button";

export function MediaGrid() {
  const items = useCreateStore((store) => store.items);

  if (items.length === 0) return null;

  return (
    <View className="gap-3">
      <ScrollView
        horizontal
        className="-mx-4"
        contentContainerClassName="gap-3 px-4"
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <MediaTile index={index} itemId={item.id} key={item.id} />
        ))}
      </ScrollView>
      <ManageMediaButton />
    </View>
  );
}
