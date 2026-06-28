import type { PointerEvent, RefObject } from "react";
import { useRef, useState } from "react";

const DRAG_THRESHOLD = 4;

export function useDragToPan({
  enabled,
  scrollRef,
}: {
  enabled: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [isPanning, setIsPanning] = useState(false);
  const suppressClickUntilRef = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    scrollLeft: number;
    scrollTop: number;
    startX: number;
    startY: number;
    didPan: boolean;
  } | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    if (!enabled || !element) return;

    element.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
      startX: event.clientX,
      startY: event.clientY,
      didPan: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    const drag = dragRef.current;
    if (!enabled || !element || !drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const movedPastThreshold =
      Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD;

    if (movedPastThreshold) {
      drag.didPan = true;
      setIsPanning(true);
    }

    if (!drag.didPan) return;

    element.scrollLeft = drag.scrollLeft - deltaX;
    element.scrollTop = drag.scrollTop - deltaY;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current;
    const drag = dragRef.current;
    if (!element || !drag || drag.pointerId !== event.pointerId) return;

    suppressClickUntilRef.current = drag.didPan ? Date.now() + 350 : 0;
    dragRef.current = null;
    setIsPanning(false);

    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  }

  function consumeSuppressedClick() {
    const shouldSuppress = Date.now() < suppressClickUntilRef.current;
    suppressClickUntilRef.current = 0;
    return shouldSuppress;
  }

  return {
    consumeSuppressedClick,
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    isPanning,
  };
}
