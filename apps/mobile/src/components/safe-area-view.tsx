import type { ViewProps } from "react-native";
import { View } from "react-native";
import { useSafeAreaInsets as useBaseSafeAreaInsets } from "react-native-safe-area-context";

export function SafeAreaView({
  top = true,
  bottom = false,
  children,
  ...props
}: {
  top?: boolean;
  bottom?: boolean;
  children?: React.ReactNode;
} & ViewProps) {
  const insets = useBaseSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: top ? insets.top : 0,
        paddingBottom: bottom ? insets.bottom : 0,
      }}
      {...props}
    >
      {children}
    </View>
  );
}

export function useSafeAreaInsets() {
  return useBaseSafeAreaInsets();
}
