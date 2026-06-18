import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@acme/std/cn";

import { MediaFrame } from "./media-frame";
import { useMediaStore } from "./store";

export function PostMediaCarousel() {
  const activeIndex = useMediaStore((store) => store.activeIndex);
  const aspectRatio = useMediaStore((store) => store.aspectRatio);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const openLightbox = useMediaStore((store) => store.openLightbox);
  const scrollRef = useMediaStore((store) => store.scrollRef);
  const setActiveIndex = useMediaStore((store) => store.setActiveIndex);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;
    const index = Math.round(element.scrollLeft / element.clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return (
    <div
      className="group bg-muted ring-border/60 relative overflow-hidden rounded-2xl ring-1"
      style={{ aspectRatio }}
    >
      <div
        className="flex size-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {mediaItems.map((media, index) => (
          <div
            className="relative size-full shrink-0 basis-full snap-center"
            key={`${media.url}-${index}`}
          >
            <MediaFrame index={index} media={media} />
            <OpenImageButton
              index={index}
              media={media}
              openLightbox={openLightbox}
            />
          </div>
        ))}
      </div>

      <CarouselControls />
    </div>
  );
}

function OpenImageButton({
  index,
  media,
  openLightbox,
}: {
  index: number;
  media: { mediaType: string };
  openLightbox: (index: number) => void;
}) {
  if (media.mediaType !== "image") return null;

  return (
    <button
      aria-label="Open image"
      className="absolute inset-0 cursor-zoom-in"
      onClick={() => openLightbox(index)}
      type="button"
    />
  );
}

function CarouselControls() {
  const activeIndex = useMediaStore((store) => store.activeIndex);
  const goToIndex = useMediaStore((store) => store.goToIndex);
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
      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white tabular-nums opacity-0 shadow-sm backdrop-blur-md transition group-hover:opacity-100">
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
        "absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:bg-black/65 focus-visible:opacity-100",
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
