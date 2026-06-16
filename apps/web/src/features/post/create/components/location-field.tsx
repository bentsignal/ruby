import { useState } from "react";
import { MapPinIcon, XIcon } from "lucide-react";

import { Button } from "@acme/ui-web/button";

import { useCreateStore } from "../store";
import { LocationSearchDialog } from "./location-search-dialog";

export function LocationField() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useCreateStore((store) => store.location);
  const clearLocation = useCreateStore((store) => store.clearLocation);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">Location</span>
      {location ? (
        <div className="border-input bg-background flex h-14 items-center gap-3 rounded-lg border px-3">
          <button
            type="button"
            className="flex h-full min-w-0 flex-1 items-center gap-3 text-left"
            onClick={() => setIsSearchOpen(true)}
          >
            <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
              <MapPinIcon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="text-foreground block truncate text-sm font-semibold">
                {location.name}
              </span>
              {location.formattedAddress ? (
                <span className="text-muted-foreground block truncate text-xs">
                  {location.formattedAddress}
                </span>
              ) : null}
            </span>
          </button>
          <Button
            aria-label="Remove location"
            size="icon"
            type="button"
            variant="ghost"
            onClick={clearLocation}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          className="h-14 justify-start rounded-lg px-3"
          type="button"
          variant="outline"
          onClick={() => setIsSearchOpen(true)}
        >
          <MapPinIcon className="size-4" />
          Add location
        </Button>
      )}
      <LocationSearchDialog
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </div>
  );
}
