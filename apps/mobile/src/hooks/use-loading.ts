import { useState } from "react";

function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  function start(callback: () => Promise<void>) {
    setIsLoading(true);
    callback()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return { isLoading, start };
}

export { useLoading };
