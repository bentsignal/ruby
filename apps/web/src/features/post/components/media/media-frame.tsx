import { Image } from "@unpic/react";

import { cn } from "@acme/std/cn";

import type { PostMediaItem } from "../../store";
import { useMediaStore } from "./store";

export function MediaFrame({
  media,
  index,
  className,
}: {
  media: PostMediaItem;
  index: number;
  className?: string;
}) {
  const reportNaturalSize = useMediaStore((store) => store.reportNaturalSize);

  return (
    <div
      className={cn(
        "bg-muted flex size-full items-center justify-center",
        className,
      )}
    >
      <MediaFrameContent
        index={index}
        media={media}
        reportNaturalSize={reportNaturalSize}
      />
    </div>
  );
}

function MediaFrameContent({
  index,
  media,
  reportNaturalSize,
}: {
  index: number;
  media: PostMediaItem;
  reportNaturalSize: (index: number, width: number, height: number) => void;
}) {
  if (media.mediaType === "video") {
    return (
      <video
        className="max-h-full max-w-full object-contain"
        controls
        playsInline
        src={media.url}
        onLoadedMetadata={(event) =>
          reportNaturalSize(
            index,
            event.currentTarget.videoWidth,
            event.currentTarget.videoHeight,
          )
        }
      />
    );
  }

  return (
    <Image
      alt={media.alt}
      className="size-full object-cover"
      height={1200}
      layout="constrained"
      src={media.url}
      width={1200}
      onLoad={(event) => {
        const target = event.currentTarget;
        reportNaturalSize(index, target.naturalWidth, target.naturalHeight);
      }}
    />
  );
}
