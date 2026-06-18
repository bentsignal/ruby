import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import { useMediaPagerStore } from "../store";

export function usePostMediaPinchOpen(index: number) {
  const openViewer = useMediaPagerStore((store) => store.openViewer);
  const hasOpened = useSharedValue(false);

  return Gesture.Pinch()
    .onBegin(() => {
      hasOpened.value = false;
    })
    .onUpdate((event) => {
      if (event.scale <= 1.08 || hasOpened.value) return;
      hasOpened.value = true;
      runOnJS(openViewer)(index);
    });
}
