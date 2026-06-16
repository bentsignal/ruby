import { useEffect } from "react";

import { toast } from "@acme/ui-web/toast";

import { useCreateStore } from "../store";

const CREATE_ERROR_TOAST_ID = "create-post-error";

export function ComposerError() {
  const error = useCreateStore((store) => store.error);
  const setError = useCreateStore((store) => store.setError);

  // eslint-disable-next-line no-restricted-syntax -- Syncs create error state to the shared Sonner toast system.
  useEffect(() => {
    function dismissError() {
      setError(null);
    }

    if (!error) {
      toast.dismiss(CREATE_ERROR_TOAST_ID);
      return;
    }

    toast.error(error, {
      id: CREATE_ERROR_TOAST_ID,
      onAutoClose: dismissError,
      onDismiss: dismissError,
      position: "top-center",
    });
  }, [error, setError]);

  return null;
}
