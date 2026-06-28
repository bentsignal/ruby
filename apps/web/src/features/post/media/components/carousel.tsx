import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import { cn } from "@acme/std/cn";

import type { PostMediaItem } from "../../store";
import { usePostStore } from "../../store";
import { useMediaStore } from "../store";
import { MediaFrame } from "./media-frame";

export function PostMediaCarousel() {
  const aspectRatio = useMediaStore((store) => store.aspectRatio);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const scrollRef = useMediaStore((store) => store.scrollRef);
  const markCarouselInteracted = useMediaStore(
    (store) => store.markCarouselInteracted,
  );
  const syncActiveIndexFromScroll = useMediaStore(
    (store) => store.syncActiveIndexFromScroll,
  );
  const [heartPopKey, setHeartPopKey] = useState(0);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;
    syncActiveIndexFromScroll(element.scrollLeft, element.clientWidth);
  }

  return (
    <div
      className="group ring-border/60 relative overflow-hidden rounded-2xl ring-1"
      style={{ aspectRatio }}
    >
      <div
        className="flex size-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        onPointerDown={markCarouselInteracted}
        ref={scrollRef}
      >
        {mediaItems.map((media, index) => (
          <MediaItem
            key={`${media.url}-${index}`}
            index={index}
            media={media}
            onDoubleTap={() => setHeartPopKey((key) => key + 1)}
          />
        ))}
      </div>

      <CarouselControls />
      <HeartOverlay popKey={heartPopKey} />
    </div>
  );
}

function HeartOverlay({ popKey }: { popKey: number }) {
  if (popKey === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <Heart
        className="animate-heart-pop size-24 text-white drop-shadow-lg"
        fill="currentColor"
        key={popKey}
      />
    </div>
  );
}

function MediaItem({
  index,
  media,
  onDoubleTap,
}: {
  index: number;
  media: PostMediaItem;
  onDoubleTap: () => void;
}) {
  const like = usePostStore((store) => store.like);

  return (
    <div
      className="relative size-full shrink-0 basis-full snap-center"
      onDoubleClick={() => {
        onDoubleTap();
        void like();
      }}
    >
      <MediaFrame index={index} media={media} />
      <OpenImageButton index={index} media={media} />
    </div>
  );
}

function OpenImageButton({
  index,
  media,
}: {
  index: number;
  media: PostMediaItem;
}) {
  const openLightbox = useMediaStore((store) => store.openLightbox);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (media.mediaType !== "image") return null;

  function handleClick() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      openLightbox(index);
    }, 220);
  }

  return (
    <button
      aria-label="Open image"
      className="absolute inset-0 cursor-zoom-in"
      onClick={handleClick}
      type="button"
    />
  );
}

function CarouselControls() {
  const activeIndex = useMediaStore((store) => store.carouselActiveIndex);
  const goToIndex = useMediaStore((store) => store.goToIndex);
  const hasCarouselInteracted = useMediaStore(
    (store) => store.hasCarouselInteracted,
  );
  const mediaItems = useMediaStore((store) => store.mediaItems);

  if (mediaItems.length <= 1) return null;

  return (
    <>
      <ArrowButton
        direction="previous"
        hidden={activeIndex === 0}
        onClick={() => goToIndex(activeIndex - 1)}
      />
      <ArrowButton
        direction="next"
        hidden={activeIndex === mediaItems.length - 1}
        onClick={() => goToIndex(activeIndex + 1)}
      />
      <div
        key={`${activeIndex}-${hasCarouselInteracted}`}
        className={cn(
          "pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white tabular-nums opacity-100 shadow-sm backdrop-blur-md transition group-focus-within:animate-none group-hover:animate-none",
          hasCarouselInteracted && "animate-post-media-counter-fade",
        )}
      >
        {activeIndex + 1} / {mediaItems.length}
      </div>
    </>
  );
}

function ArrowButton({
  direction,
  hidden,
  onClick,
}: {
  direction: "previous" | "next";
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      aria-label={direction === "previous" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-black/65 focus-visible:opacity-100",
        direction === "previous" ? "left-2" : "right-2",
        hidden && "pointer-events-none !opacity-0",
      )}
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  );
}
