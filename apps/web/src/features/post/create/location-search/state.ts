import { useLocationSearchState } from "@acme/features/post-create/location-search-state";

import { useCreateStore } from "../store";

export function useLocationSearch({
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

  return useLocationSearchState({
    isOpen,
    onOpenChange,
    onResolveEnd: finishLocationResolve,
    onResolveStart: startLocationResolve,
    setLocation,
  });
}
