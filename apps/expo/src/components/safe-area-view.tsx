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
        marginTop: top ? insets.top : 0,
        marginBottom: bottom ? insets.bottom : 0,
      }}
      {...props}
    >
      {children}
    </View>
  );
}

export { SafeAreaView };
