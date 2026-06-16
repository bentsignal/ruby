import { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { CaptionField } from "~/features/post/create/components/caption-field";
import { ComposerError } from "~/features/post/create/components/composer-error";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaGrid } from "~/features/post/create/components/media-grid";
import { MediaPicker } from "~/features/post/create/components/media-picker";
import { CreateStore } from "~/features/post/create/store";

export default function Create() {
  const scrollViewRef = useRef<ScrollView>(null);

  function scrollToCaption() {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  }

  return (
    <CreateStore>
      <SafeAreaView className="bg-background flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerClassName="gap-5 px-4 pt-4 pb-32"
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
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
              <LocationField />
              <CaptionField onFocus={scrollToCaption} />
              <ComposerError />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CreateStore>
  );
}
