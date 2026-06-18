import { createStore } from "rostra";

import { useLocationSearchState } from "@acme/features/post-create/location-search-state";

import { useColor } from "~/hooks/use-color";
import { useCreateStore } from "../store";

function useInternalStore({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const finishLocationResolve = useCreateStore(
    (store) => store.finishLocationResolve,
  );
  const setLocation = useCreateStore((store) => store.setLocation);
  const startLocationResolve = useCreateStore(
    (store) => store.startLocationResolve,
  );
  const search = useLocationSearchState({
    isOpen,
    onOpenChange,
    onResolveEnd: finishLocationResolve,
    onResolveStart: startLocationResolve,
    setLocation,
  });

  return {
    foreground,
    isOpen,
    mutedForeground,
    ...search,
  };
}

export const {
  Store: LocationSearchSheetStore,
  useStore: useLocationSearchSheetStore,
} = createStore(useInternalStore);
