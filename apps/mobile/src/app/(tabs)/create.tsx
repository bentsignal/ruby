import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { LockKeyhole } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { SafeAreaView } from "~/components/safe-area-view";
import { AspectRatioField } from "~/features/post/create/components/aspect-ratio-field";
import { CaptionField } from "~/features/post/create/components/caption-field";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaPicker } from "~/features/post/create/components/media-picker";
import { PreviewPostButton } from "~/features/post/create/components/preview-post-button";
import { MediaGrid } from "~/features/post/create/media-grid/media-grid";
import { CreateStore, useCreateStore } from "~/features/post/create/store";
import { useColor } from "~/hooks/use-color";

export default function Create() {
  const scrollViewRef = useRef<ScrollView>(null);

  function scrollToCaption() {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  }

  return (
    <CreateStore>
      <CreateContent
        scrollToCaption={scrollToCaption}
        scrollViewRef={scrollViewRef}
      />
    </CreateStore>
  );
}

function CreateContent({
  scrollToCaption,
  scrollViewRef,
}: {
  scrollToCaption: () => void;
  scrollViewRef: RefObject<ScrollView | null>;
}) {
  const isPosting = useCreateStore((store) => store.isPosting);
  const { data: permissions } = useQuery({
    ...convexQuery(api.permissions.queries.getMine, {}),
    select: (value) => value,
  });

  if (!permissions) return <CreateAccessLoading />;

  const canPost = permissions.includes("can-post");
  if (!canPost) return <CreateClosedBeta />;

  if (isPosting) return <SubmittingPost />;

  return (
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
          <View className="gap-3 px-2">
            <Text className="text-foreground text-xl font-black tracking-normal">
              Create a new post
            </Text>
            <View className="flex-row items-center gap-2">
              <PreviewPostButton className="flex-1" />
              <CreatePostButton className="flex-1" />
            </View>
          </View>
          <View className="gap-3">
            <MediaPicker />
            <MediaGrid />
            <AspectRatioField />
          </View>
          <View className="gap-5 px-2">
            <LocationField />
            <CaptionField onFocus={scrollToCaption} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CreateAccessLoading() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-8 pb-20">
        <LoadingBars />
      </View>
    </SafeAreaView>
  );
}

function CreateClosedBeta() {
  const primary = useColor("primary");

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-5 pb-20">
        <View className="mb-4 items-center gap-3">
          <LockKeyhole size={34} strokeWidth={1.9} color={primary} />
          <View className="bg-primary h-1 w-10 rounded-full" />
        </View>
        <Text className="text-foreground text-center text-2xl font-black tracking-normal">
          Posting is invite only
        </Text>
        <Text className="text-muted-foreground mt-3 max-w-xs text-center text-sm leading-6 font-medium">
          Ruby is in closed beta, so only invited members can share posts right
          now.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SubmittingPost() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-8 pb-20">
        <View className="items-center">
          <Text className="text-foreground text-center text-2xl font-black tracking-normal">
            Submitting post
          </Text>
          <Text className="text-muted-foreground mt-3 max-w-xs text-center text-sm leading-6 font-medium">
            Hang tight for just a sec while your post goes live.
          </Text>
          <LoadingBars />
        </View>
      </View>
    </SafeAreaView>
  );
}

function LoadingBars() {
  return (
    <View className="mt-6 w-40 flex-row justify-center gap-2">
      <LoadingBar delay={0} />
      <LoadingBar delay={150} />
      <LoadingBar delay={300} />
    </View>
  );
}

function LoadingBar({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);

  // eslint-disable-next-line no-restricted-syntax -- Starts a native UI-thread animation for the submitting indicator.
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 450 }),
          withTiming(0.35, { duration: 450 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View className="bg-primary h-1 flex-1" style={animatedStyle} />
  );
}
