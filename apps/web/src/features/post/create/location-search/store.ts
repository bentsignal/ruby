import { createStore } from "rostra";

import { useLocationSearchState } from "@acme/features/post-create/location-search-state";

import { useCreateStore } from "../store";

function useInternalStore({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
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
    isOpen,
    ...search,
  };
}

export const {
  Store: LocationSearchDialogStore,
  useStore: useLocationSearchDialogStore,
} = createStore(useInternalStore);
