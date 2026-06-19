import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { usePostStore } from "../../store";
import { useMediaPagerStore } from "../store";

export function usePostMediaDoubleTapLike() {
  const like = usePostStore((store) => store.like);
  const triggerHeartPop = useMediaPagerStore((store) => store.triggerHeartPop);

  return Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(triggerHeartPop)();
      runOnJS(like)();
    });
}
