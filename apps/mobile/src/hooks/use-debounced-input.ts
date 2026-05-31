import { useEffect, useState } from "react";

export function useDebouncedInput(time = 500) {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  // eslint-disable-next-line no-restricted-syntax -- Debouncing needs a timer tied to value changes.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => clearTimeout(timeout);
  }, [value, time]);

  return { value, setValue, debouncedValue };
}
