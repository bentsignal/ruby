import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Heart } from "lucide-react-native";

import { useMediaPagerStore } from "../store";

export function HeartOverlay() {
  const heartPopKey = useMediaPagerStore((store) => store.heartPopKey);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // eslint-disable-next-line no-restricted-syntax -- Triggers a UI-thread animation when the double-tap key changes.
  useEffect(() => {
    if (heartPopKey === 0) return;
    scale.value = withSequence(
      withTiming(1.2, { duration: 120 }),
      withDelay(400, withTiming(0, { duration: 300 })),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withDelay(400, withTiming(0, { duration: 300 })),
    );
  }, [heartPopKey, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="pointer-events-none absolute inset-0 items-center justify-center">
      <Animated.View style={animatedStyle}>
        <Heart color="white" fill="white" size={96} />
      </Animated.View>
    </View>
  );
}
