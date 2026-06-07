import type { ViewStyle } from "react-native";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";

const ABSOLUTE_FILL_STYLE = {
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
} satisfies ViewStyle;

export function TabBarBackdrop({
  liquidGlassIsAvailable,
  sidebar,
}: {
  liquidGlassIsAvailable: boolean;
  sidebar: string;
}) {
  if (!liquidGlassIsAvailable) {
    return (
      <>
        <BlurView
          intensity={82}
          style={ABSOLUTE_FILL_STYLE}
          tint="systemMaterialDark"
        />
        <View
          pointerEvents="none"
          style={[
            ABSOLUTE_FILL_STYLE,
            { backgroundColor: withAlpha(sidebar, 0.78) },
          ]}
        />
      </>
    );
  }

  return (
    <>
      <View
        pointerEvents="none"
        style={[
          ABSOLUTE_FILL_STYLE,
          { backgroundColor: withAlpha(sidebar, 0.24) },
        ]}
      />
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={ABSOLUTE_FILL_STYLE}
        tintColor={sidebar}
      />
    </>
  );
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#")) return color;

  const hex = color.slice(1);
  if (hex.length !== 6) return color;

  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${hex}${alphaHex}`;
}
