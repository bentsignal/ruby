import type { RefObject } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRef } from "react";
import * as Haptics from "expo-haptics";

import type { PullToRefreshState } from "~/features/post/pull-to-refresh";
import {
  getPullToRefreshState,
  PULL_TO_REFRESH_HAPTIC_RESET_THRESHOLD,
  PULL_TO_REFRESH_THRESHOLD,
} from "~/features/post/pull-to-refresh";

interface UsePostListPullToRefreshArgs {
  onPullToRefreshStateChange?: (state: PullToRefreshState) => void;
  onRefresh: () => Promise<void> | void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const SETTLED_OFFSET_Y = 0;

export function usePostListPullToRefresh({
  onPullToRefreshStateChange,
  onRefresh,
  onScroll,
}: UsePostListPullToRefreshArgs) {
  const hapticPlayedRef = useRef(false);
  const lastOffsetYRef = useRef(0);
  const refreshCommittedRef = useRef(false);
  const refreshSettledRef = useRef(true);
  const stateRef = useRef<PullToRefreshState>("idle");

  function emitState(state: PullToRefreshState) {
    if (stateRef.current === state) return;
    stateRef.current = state;
    onPullToRefreshStateChange?.(state);
  }

  function finishRefreshIfReady() {
    if (
      !refreshCommittedRef.current ||
      !refreshSettledRef.current ||
      lastOffsetYRef.current < SETTLED_OFFSET_Y
    ) {
      return;
    }

    refreshCommittedRef.current = false;
    hapticPlayedRef.current = false;
    emitState("idle");
  }

  function startRefresh() {
    if (refreshCommittedRef.current) return;

    refreshCommittedRef.current = true;
    refreshSettledRef.current = false;
    emitState("refreshing");
    void Promise.resolve(onRefresh())
      .catch(() => undefined)
      .finally(() => {
        refreshSettledRef.current = true;
        finishRefreshIfReady();
      });
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    lastOffsetYRef.current = offsetY;

    if (refreshCommittedRef.current) {
      emitState("refreshing");
      finishRefreshIfReady();
      onScroll?.(event);
      return;
    }

    updateThresholdHaptic({ hapticPlayedRef, offsetY });
    emitState(getPullToRefreshState({ offsetY, refreshing: false }));
    onScroll?.(event);
  }

  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetY = event.nativeEvent.contentOffset.y;
    lastOffsetYRef.current = offsetY;
    if (stateRef.current !== "ready" && offsetY > -PULL_TO_REFRESH_THRESHOLD) {
      return;
    }

    startRefresh();
  }

  function handleMomentumScrollEnd(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    lastOffsetYRef.current = event.nativeEvent.contentOffset.y;
    finishRefreshIfReady();
  }

  return { handleMomentumScrollEnd, handleScroll, handleScrollEndDrag };
}

function updateThresholdHaptic({
  hapticPlayedRef,
  offsetY,
}: {
  hapticPlayedRef: RefObject<boolean>;
  offsetY: number;
}) {
  if (offsetY <= -PULL_TO_REFRESH_THRESHOLD && !hapticPlayedRef.current) {
    hapticPlayedRef.current = true;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  if (offsetY > -PULL_TO_REFRESH_HAPTIC_RESET_THRESHOLD) {
    hapticPlayedRef.current = false;
  }
}
