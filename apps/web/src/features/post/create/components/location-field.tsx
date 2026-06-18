import { useState } from "react";
import { MapPinIcon, XIcon } from "lucide-react";

import { Button } from "@acme/ui-web/button";

import { LocationSearchDialog } from "../location-search/location-search-dialog";
import { useCreateStore } from "../store";

export function LocationField() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">Location</span>
      <LocationPicker />
    </div>
  );
}

function LocationPicker() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isLocationResolving = useCreateStore(
    (store) => store.isLocationResolving,
  );
  const location = useCreateStore((store) => store.location);
  const clearLocation = useCreateStore((store) => store.clearLocation);

  function openSearch() {
    setIsSearchOpen(true);
  }

  if (isLocationResolving) {
    return (
      <LocationPickerFrame
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      >
        <LocationShell />
      </LocationPickerFrame>
    );
  }

  if (!location) {
    return (
      <LocationPickerFrame
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      >
        <Button
          className="h-14 justify-start rounded-lg px-3"
          type="button"
          variant="outline"
          onClick={openSearch}
        >
          <MapPinIcon className="size-4" />
          Add location
        </Button>
      </LocationPickerFrame>
    );
  }

  return (
    <LocationPickerFrame
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
    >
      <LocationShell>
        <button
          type="button"
          className="flex h-full min-w-0 flex-1 items-center text-left"
          onClick={openSearch}
        >
          <span
            key={location.googlePlaceId}
            className="animate-in fade-in min-w-0"
          >
            <span className="text-foreground block truncate text-sm font-semibold">
              {location.name}
            </span>
            <LocationAddress address={location.formattedAddress} />
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
      </LocationShell>
    </LocationPickerFrame>
  );
}

function LocationShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-input bg-background flex h-14 items-center gap-3 rounded-lg border px-3">
      <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
        <MapPinIcon className="size-4" />
      </span>
      {children}
    </div>
  );
}

function LocationPickerFrame({
  children,
  isSearchOpen,
  setIsSearchOpen,
}: {
  children: React.ReactNode;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}) {
  return (
    <>
      {children}
      <LocationSearchDialogHost
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </>
  );
}

function LocationSearchDialogHost({
  isSearchOpen,
  setIsSearchOpen,
}: {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}) {
  if (!isSearchOpen) return null;

  return (
    <LocationSearchDialog
      isOpen={isSearchOpen}
      onOpenChange={setIsSearchOpen}
    />
  );
}

function LocationAddress({ address }: { address?: string }) {
  if (!address) {
    return null;
  }

  return (
    <span className="text-muted-foreground block truncate text-xs">
      {address}
    </span>
  );
}
