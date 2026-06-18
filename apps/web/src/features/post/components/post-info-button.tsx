import { useState } from "react";
import { CalendarDays, Info, MapPin } from "lucide-react";

import { googleMapsWebUrl } from "@acme/std/maps";
import * as Dialog from "@acme/ui-web/dialog";

import { usePostStore } from "../store";

function formatFullDate(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function PostInfoButton() {
  const createdAt = usePostStore((store) => store.createdAt);
  const location = usePostStore((store) => store.location);
  const [isOpen, setIsOpen] = useState(false);

  const locationLabel = location?.name ?? location?.formattedAddress ?? null;

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger
        aria-label="Post details"
        className="text-muted-foreground hover:text-primary focus-visible:text-primary grid size-9 cursor-pointer place-items-center rounded-full transition-colors active:scale-95"
      >
        <Info className="size-5" />
      </Dialog.Trigger>
      <Dialog.Content className="max-w-sm gap-4" showCloseButton>
        <Dialog.Title>Details</Dialog.Title>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-muted-foreground size-5 shrink-0" />
            <span>{formatFullDate(createdAt)}</span>
          </div>
          {locationLabel && location && (
            <a
              className="text-secondary hover:text-secondary/80 flex items-center gap-3 font-semibold transition-colors"
              href={googleMapsWebUrl(location)}
              rel="noreferrer"
              target="_blank"
            >
              <MapPin className="size-5 shrink-0" />
              <span>{locationLabel}</span>
            </a>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Container>
  );
}
