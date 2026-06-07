import { useCreateStore } from "../store";

export function ComposerError() {
  const error = useCreateStore((store) => store.error);

  if (!error) return null;

  return <p className="text-destructive text-sm">{error}</p>;
}
