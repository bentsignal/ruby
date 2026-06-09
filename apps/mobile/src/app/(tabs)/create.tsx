import type { KeyboardAwareScrollViewRef } from "react-native-keyboard-controller";
import { useRef } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { SafeAreaView } from "~/components/safe-area-view";
import { CaptionField } from "~/features/post/create/components/caption-field";
import { ComposerError } from "~/features/post/create/components/composer-error";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { MediaGrid } from "~/features/post/create/components/media-grid";
import { MediaPicker } from "~/features/post/create/components/media-picker";
import { CreateStore } from "~/features/post/create/store";

export default function Create() {
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);

  function scrollToCaption() {
    setTimeout(() => scrollViewRef.current?.assureFocusedInputVisible(), 120);
  }

  return (
    <CreateStore>
      <SafeAreaView className="bg-background flex-1">
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          bottomOffset={44}
          className="flex-1"
          contentContainerClassName="gap-5 px-4 pt-4 pb-32"
          disableScrollOnKeyboardHide
          extraKeyboardSpace={32}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          mode="insets"
        >
          <View className="flex-row items-center justify-between gap-4 px-2 pb-3">
            <Text className="text-foreground text-3xl font-black tracking-normal">
              Create
            </Text>
            <CreatePostButton />
          </View>
          <MediaPicker />
          <MediaGrid />
          <View className="gap-5 px-2 pt-3">
            <CaptionField onFocus={scrollToCaption} />
            <ComposerError />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </CreateStore>
  );
}
