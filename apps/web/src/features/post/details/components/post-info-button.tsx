import { useState } from "react";
import { CalendarDays, Info, MapPin } from "lucide-react";

import * as Dialog from "@acme/ui-web/dialog";

import { usePostDetails } from "../hooks/use-post-details";

export function PostInfoButton() {
  const { formattedDate } = usePostDetails();
  const [isOpen, setIsOpen] = useState(false);

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
            <span>{formattedDate}</span>
          </div>
          <PostLocationLink />
        </div>
      </Dialog.Content>
    </Dialog.Container>
  );
}

function PostLocationLink() {
  const { locationLabel, mapUrl } = usePostDetails();

  if (!locationLabel || !mapUrl) return null;

  return (
    <a
      className="text-secondary hover:text-secondary/80 flex items-center gap-3 font-semibold transition-colors"
      href={mapUrl}
      rel="noreferrer"
      target="_blank"
    >
      <MapPin className="size-5 shrink-0" />
      <span>{locationLabel}</span>
    </a>
  );
}
