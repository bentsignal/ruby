import { Image } from "@unpic/react";

import type { PostMediaItem as UIPostMediaItem } from "../store";

export function PostMediaItem({ media }: { media: UIPostMediaItem }) {
  if (media.mediaType === "video") {
    return (
      <div className="bg-muted relative w-full overflow-hidden rounded-lg">
        <video
          className="max-h-[640px] w-full object-cover"
          controls
          playsInline
          src={media.url}
        />
      </div>
    );
  }

  return (
    <div className="bg-muted relative w-full overflow-hidden rounded-lg">
      <Image
        alt={media.alt}
        className="object-cover"
        height={600}
        layout="constrained"
        src={media.url}
        width={800}
      />
    </div>
  );
}
