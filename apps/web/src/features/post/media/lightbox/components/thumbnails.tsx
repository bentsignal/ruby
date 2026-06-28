import { Play } from "lucide-react";

import { cn } from "@acme/std/cn";

import { Image } from "~/components/image";
import { useMediaStore } from "../../store";

export function ThumbnailStripHost() {
  const mediaItems = useMediaStore((store) => store.mediaItems);

  if (mediaItems.length <= 1) return null;

  return <ThumbnailStrip />;
}

function ThumbnailStrip() {
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setLightboxActiveIndex);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-linear-to-t from-black/70 via-black/25 to-transparent px-4 pt-12 pb-5 sm:pb-6">
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center justify-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950/45 p-1.5 shadow-2xl backdrop-blur-md [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        {mediaItems.map((media, index) => (
          <button
            aria-label={`Show item ${index + 1}`}
            className={cn(
              "size-14 shrink-0 overflow-hidden rounded-lg border p-0.5 transition sm:size-16",
              index === activeIndex
                ? "border-white/80 bg-white/15 opacity-100"
                : "border-transparent bg-white/5 opacity-60 hover:bg-white/10 hover:opacity-100",
            )}
            key={`${media.url}-${index}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <ThumbnailMedia media={media} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ThumbnailMedia({
  media,
}: {
  media: { mediaType: string; url: string };
}) {
  if (media.mediaType === "video") {
    return (
      <span className="grid size-full place-items-center rounded-[5px] bg-white/10">
        <Play className="size-5 text-white" />
      </span>
    );
  }

  return (
    <Image
      alt=""
      className="size-full rounded-[5px] object-cover"
      height={64}
      src={media.url}
      width={64}
    />
  );
}
