import type { ViewProps } from "react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SafeAreaView({
  top = true,
  bottom = false,
  children,
  ...props
}: {
  top?: boolean;
  bottom?: boolean;
  children?: React.ReactNode;
} & ViewProps) {
  const insets = useSafeAreaInsets();
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

export { SafeAreaView };
