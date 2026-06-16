import { useEffect } from "react";
import { Alert } from "react-native";

import { useCreateStore } from "../store";

export function ComposerError() {
  const error = useCreateStore((store) => store.error);
  const setError = useCreateStore((store) => store.setError);

  // eslint-disable-next-line no-restricted-syntax -- Syncs create error state to the native platform alert.
  useEffect(() => {
    function dismissError() {
      setError(null);
    }

    if (!error) return;

    Alert.alert("Error", error, [{ onPress: dismissError, text: "OK" }], {
      cancelable: true,
      onDismiss: dismissError,
    });
  }, [error, setError]);

  return null;
}
