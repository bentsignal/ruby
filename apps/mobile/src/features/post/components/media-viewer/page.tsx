import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Play } from "lucide-react-native";

import type { PostMediaItem } from "../../store";
import { useMediaViewerStore } from "./store";

const MAX_SCALE = 4;

export function ViewerPage({ media }: { media: PostMediaItem }) {
  const handleZoomChange = useMediaViewerStore(
    (store) => store.handleZoomChange,
  );
  const isZoomed = useMediaViewerStore((store) => store.isZoomed);
  const toggleControls = useMediaViewerStore((store) => store.toggleControls);
  const { height, width } = useWindowDimensions();

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  function reset() {
    "worklet";
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedX.value = 0;
    savedY.value = 0;
    runOnJS(handleZoomChange)(false);
  }

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, savedScale.value * event.scale);
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        reset();
      } else {
        scale.value = Math.min(scale.value, MAX_SCALE);
        savedScale.value = scale.value;
        runOnJS(handleZoomChange)(true);
      }
    });

  const pan = Gesture.Pan()
    .enabled(isZoomed)
    .onUpdate((event) => {
      translateX.value = savedX.value + event.translationX;
      translateY.value = savedY.value + event.translationY;
    })
    .onEnd(() => {
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        reset();
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
        runOnJS(handleZoomChange)(true);
      }
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      runOnJS(toggleControls)();
    });

  const gesture = Gesture.Simultaneous(
    pinch,
    pan,
    Gesture.Exclusive(doubleTap, singleTap),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (media.mediaType === "video") {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-black">
        <Play color="white" size={40} />
        <Text className="text-sm text-white/70">Video</Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1 items-center justify-center bg-black">
        <Animated.Image
          resizeMode="contain"
          source={{ uri: media.url }}
          style={[{ height, width }, animatedStyle]}
        />
      </View>
    </GestureDetector>
  );
}
