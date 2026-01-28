import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { LoadingSpinner } from "~/components/loading-spinner";
import { SafeAreaView } from "~/components/safe-area-view";

function ProfileLoading() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
    }, 2000);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Animated.View style={animatedStyle}>
        <LoadingSpinner />
      </Animated.View>
    </SafeAreaView>
  );
}

export { ProfileLoading };
