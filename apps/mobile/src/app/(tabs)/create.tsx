import { ScrollView, View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { CreateFooter } from "~/features/post/create-composer/components/create-footer";
import { CreateHeader } from "~/features/post/create-composer/components/create-header";
import { EmptyMediaPicker } from "~/features/post/create-composer/components/empty-media-picker";
import { MediaTile } from "~/features/post/create-composer/components/media-tile";
import { useCreateComposer } from "~/features/post/create-composer/hooks/use-create-composer";

export default function Create() {
  const composer = useCreateComposer();

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pt-4 pb-32"
        keyboardShouldPersistTaps="handled"
      >
        <CreateHeader
          canPost={composer.canPost}
          hasUploadingItems={composer.hasUploadingItems}
          isPosting={composer.isPosting}
          onPost={composer.confirmPost}
        >
          {composer.items.length === 0 && (
            <EmptyMediaPicker
              foreground={composer.foreground}
              onPress={composer.pickFiles}
            />
          )}
        </CreateHeader>

        {composer.items.length > 0 && (
          <View
            className="-mx-1.5 flex-row flex-wrap"
            onLayout={composer.handleGridLayout}
          >
            {composer.items.map((item, index) => (
              <MediaTile
                activeDragItemId={composer.activeDragItemId}
                beginReorder={composer.beginReorder}
                endReorder={composer.endReorder}
                foreground={composer.foreground}
                index={index}
                item={item}
                key={item.id}
                removeItem={composer.removeItem}
                retryItem={composer.retryItem}
                updateReorder={composer.updateReorder}
              />
            ))}
          </View>
        )}

        <CreateFooter
          caption={composer.caption}
          error={composer.error}
          foreground={composer.foreground}
          hasItems={composer.items.length > 0}
          mutedForeground={composer.mutedForeground}
          onAddMedia={composer.pickFiles}
          setCaption={composer.setCaption}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
