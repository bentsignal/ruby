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
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaPicker } from "~/features/post/create/components/media-picker";
import { MediaGrid } from "~/features/post/create/media-grid/media-grid";
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
            <View className="flex-row items-center justify-between gap-4 px-2">
              <Text className="text-foreground text-xl font-black tracking-normal">
                Create a new post
              </Text>
              <CreatePostButton />
            </View>
            <View className="gap-3">
              <MediaPicker />
              <MediaGrid />
            </View>
            <View className="gap-5 px-2">
              <LocationField />
              <CaptionField onFocus={scrollToCaption} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CreateStore>
  );
}
