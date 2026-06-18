import { LoaderCircleIcon, MapPinIcon, SearchIcon } from "lucide-react";

import type { LocationPrediction } from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";
import * as Dialog from "@acme/ui-web/dialog";
import { Input } from "@acme/ui-web/input";

import {
  LocationSearchDialogStore,
  useLocationSearchDialogStore,
} from "./store";

export function LocationSearchDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <LocationSearchDialogStore isOpen={isOpen} onOpenChange={onOpenChange}>
      <LocationSearchDialogContent />
    </LocationSearchDialogStore>
  );
}

function LocationSearchDialogContent() {
  const handleOpenChange = useLocationSearchDialogStore(
    (store) => store.handleOpenChange,
  );
  const isOpen = useLocationSearchDialogStore((store) => store.isOpen);

  return (
    <Dialog.Container open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content
        className="gap-0 overflow-hidden p-0 sm:max-w-xl"
        style={{
          gridTemplateRows: "auto auto minmax(0, 1fr)",
          height: "min(640px, calc(100vh - 2rem))",
        }}
      >
        <Dialog.Header className="border-border border-b px-5 pt-5 pb-4">
          <Dialog.Title>Add location</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search Google Maps places.
          </Dialog.Description>
        </Dialog.Header>
        <LocationSearchInput />
        <LocationResults />
      </Dialog.Content>
    </Dialog.Container>
  );
}

function LocationSearchInput() {
  const search = useLocationSearchDialogStore((store) => store.search);
  const setSearch = useLocationSearchDialogStore((store) => store.setSearch);

  return (
    <div className="px-5 py-4">
      <div className="relative">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          autoFocus
          className="h-11 rounded-lg py-0 pl-9 leading-none"
          placeholder="Search places"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
    </div>
  );
}

function LocationResults() {
  const isLoading = useLocationSearchDialogStore((store) => store.isLoading);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto px-3 pb-2"
      aria-busy={isLoading}
    >
      <LocationStatus />
      <PredictionRows />
    </div>
  );
}

function LocationStatus() {
  const isLoading = useLocationSearchDialogStore((store) => store.isLoading);
  const predictions = useLocationSearchDialogStore(
    (store) => store.predictions,
  );
  const search = useLocationSearchDialogStore((store) => store.search);
  const searchError = useLocationSearchDialogStore(
    (store) => store.searchError,
  );
  const showEmptyState =
    search.trim().length >= PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH &&
    !isLoading &&
    !searchError &&
    predictions.length === 0;

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-28 items-center justify-center gap-2 text-sm">
        <LoaderCircleIcon className="size-4 animate-spin" />
        Searching
      </div>
    );
  }
  if (searchError) {
    return (
      <div className="text-destructive flex h-28 items-center justify-center text-sm">
        {searchError}
      </div>
    );
  }
  if (showEmptyState) {
    return (
      <div className="text-muted-foreground flex h-28 items-center justify-center text-sm">
        No locations found
      </div>
    );
  }
  return null;
}

function PredictionRows() {
  const isLoading = useLocationSearchDialogStore((store) => store.isLoading);
  const predictions = useLocationSearchDialogStore(
    (store) => store.predictions,
  );
  const searchError = useLocationSearchDialogStore(
    (store) => store.searchError,
  );
  const selectPrediction = useLocationSearchDialogStore(
    (store) => store.selectPrediction,
  );

  if (isLoading || searchError) {
    return null;
  }

  return predictions.map((prediction) => (
    <PredictionRow
      key={prediction.id}
      prediction={prediction}
      selectPrediction={selectPrediction}
    />
  ));
}

function PredictionRow({
  prediction,
  selectPrediction,
}: {
  prediction: LocationPrediction;
  selectPrediction: (prediction: LocationPrediction) => void;
}) {
  return (
    <button
      type="button"
      className="hover:bg-accent focus-visible:ring-ring flex w-full items-center gap-3 rounded-md px-2 py-3 text-left outline-none focus-visible:ring-2"
      onClick={() => selectPrediction(prediction)}
    >
      <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
        <MapPinIcon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="text-foreground block truncate text-sm font-semibold">
          {prediction.title}
        </span>
        <PredictionSubtitle subtitle={prediction.subtitle} />
      </span>
    </button>
  );
}

function PredictionSubtitle({ subtitle }: { subtitle?: string }) {
  if (!subtitle) {
    return null;
  }

  return (
    <span className="text-muted-foreground block truncate text-xs">
      {subtitle}
    </span>
  );
}
