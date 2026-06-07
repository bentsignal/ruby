import { usePostStore } from "../store";

export function PostCaption() {
  const caption = usePostStore((store) => store.caption);

  if (!caption) return null;
  return <p className="text-sm leading-relaxed">{caption}</p>;
}
