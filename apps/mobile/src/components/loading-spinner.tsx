import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { Loader } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";

const LoadingSpinner = ({
  color = "foreground",
  className,
}: {
  color?: string;
  className?: string;
}) => {
  const cssColor = useColor(color);
  const rotation = useSharedValue(0);
  useEffect(() => {
    const spin = () => {
      "worklet";
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    };
    scheduleOnUI(spin);
  }, [rotation]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <Loader color={cssColor} className={className} />
    </Animated.View>
  );
};

export { LoadingSpinner };
