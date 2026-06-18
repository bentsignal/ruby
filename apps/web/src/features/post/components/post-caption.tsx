import { usePostStore } from "../store";

export function PostCaption() {
  const caption = usePostStore((store) => store.caption);

  if (!caption) return null;

  return (
    <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
      {caption}
    </p>
  );
}
