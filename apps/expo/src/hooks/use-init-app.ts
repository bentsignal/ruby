import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import * as SystemUI from "expo-system-ui";
import { Roboto_500Medium } from "@expo-google-fonts/roboto/500Medium";
import { useFonts } from "@expo-google-fonts/roboto/useFonts";

import { useVar } from "~/hooks/use-color";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const useInitApp = () => {
  const backgroundColor = useVar("background");
  const colorScheme = useColorScheme();

  // initialize root background color to match system theme
  const [backgroundColorsAreLoaded, setBackgroundColorsAreLoaded] =
    useState(false);
  useEffect(() => {
    const init = async () => {
      await SystemUI.setBackgroundColorAsync(backgroundColor);
      setBackgroundColorsAreLoaded(true);
    };
    void init();
  }, [backgroundColor, backgroundColorsAreLoaded]);

  // update root background color whenever the system color scheme changes
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor, colorScheme]);

  const [fontsAreLoaded] = useFonts({
    Roboto_500Medium,
  });

  return {
    backgroundColorsAreLoaded,
    fontsAreLoaded,
  };
};

export { useInitApp };
