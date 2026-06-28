import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useMediaStore } from "../store";
import { LightboxStage } from "./components/stage";

export function PostMediaLightbox() {
  const closeLightbox = useMediaStore((store) => store.closeLightbox);
  const isLightboxOpen = useMediaStore((store) => store.isLightboxOpen);

  // eslint-disable-next-line no-restricted-syntax -- The fullscreen viewer must sync body scroll locking and Escape handling with browser APIs.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, isLightboxOpen]);

  if (!isLightboxOpen) return null;

  return createPortal(
    <div
      aria-label="Media viewer"
      aria-modal="true"
      className="animate-in fade-in-0 fixed inset-0 z-50 overflow-hidden bg-black text-white duration-200"
      role="dialog"
    >
      <LightboxContent />
    </div>,
    document.body,
  );
}

function LightboxContent() {
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
  const closeLightbox = useMediaStore((store) => store.closeLightbox);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setLightboxActiveIndex);

  const activeItem = mediaItems[activeIndex];

  // eslint-disable-next-line no-restricted-syntax -- The fullscreen viewer needs document-level arrow-key navigation while it is open.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      if (event.key === "ArrowRight" && activeIndex < mediaItems.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, mediaItems.length, setActiveIndex]);

  if (!activeItem) return null;

  return (
    <LightboxStage
      activeIndex={activeIndex}
      activeItem={activeItem}
      closeLightbox={closeLightbox}
      key={activeIndex}
      mediaItems={mediaItems}
      setActiveIndex={setActiveIndex}
    />
  );
}
