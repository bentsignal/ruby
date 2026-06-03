import { useScreenSize } from "./use-screen-size";
import { useScreenType } from "./use-screen-type";

export function useScreen() {
  const screenType = useScreenType();
  const screenSize = useScreenSize();

  if (screenSize && screenType) {
    return {
      size: screenSize,
      type: screenType,
    };
  }

  return undefined;
}
