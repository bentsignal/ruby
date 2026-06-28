import type { Dispatch, SetStateAction } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@acme/ui-web/button";

import type { PostMediaItem } from "../../../store";

export const BASE_ZOOM_LEVEL = 1;
export const DEFAULT_ZOOM_LEVEL = 2;

export function ZoomButton({
  mediaType,
  setZoomLevel,
  zoomLevel,
}: {
  mediaType: PostMediaItem["mediaType"];
  setZoomLevel: Dispatch<SetStateAction<number>>;
  zoomLevel: number;
}) {
  if (mediaType !== "image") return null;

  const isZoomed = zoomLevel > BASE_ZOOM_LEVEL;
  const Icon = isZoomed ? ZoomOut : ZoomIn;

  return (
    <Button
      aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      className="bg-black/45 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15"
      onClick={() =>
        setZoomLevel(isZoomed ? BASE_ZOOM_LEVEL : DEFAULT_ZOOM_LEVEL)
      }
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-5" />
    </Button>
  );
}
