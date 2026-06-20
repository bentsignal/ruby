import { View } from "react-native";
import { ArrowDown } from "lucide-react-native";

import { LoadingSpinner } from "~/components/loading-spinner";
import { useColor } from "~/hooks/use-color";

export const PULL_TO_REFRESH_THRESHOLD = 80;
export const PULL_TO_REFRESH_HAPTIC_RESET_THRESHOLD = 40;

export type PullToRefreshState = "idle" | "pulling" | "ready" | "refreshing";

export function getPullToRefreshState({
  offsetY,
  refreshing,
}: {
  offsetY: number;
  refreshing: boolean;
}) {
  if (refreshing) return "refreshing";
  if (offsetY <= -PULL_TO_REFRESH_THRESHOLD) return "ready";
  if (offsetY < 0) return "pulling";
  return "idle";
}

export function PullToRefreshIndicator({
  color = "foreground",
  size = 28,
  state,
}: {
  color?: string;
  size?: number;
  state: PullToRefreshState;
}) {
  const cssColor = useColor(color);

  if (state === "ready" || state === "refreshing") {
    return <LoadingSpinner color={color} size={size} />;
  }

  if (state === "pulling") {
    return <ArrowDown color={cssColor} size={size} strokeWidth={2.25} />;
  }

  return null;
}

export function PullToRefreshOverlay({ state }: { state: PullToRefreshState }) {
  return (
    <View
      pointerEvents="none"
      className="absolute top-0 right-0 left-0 z-30 items-center"
      style={{ opacity: state === "idle" ? 0 : 1 }}
    >
      <View className="h-12 w-12 items-center justify-center">
        <PullToRefreshIndicator state={state} />
      </View>
    </View>
  );
}
