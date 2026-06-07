import { usePostStore } from "../store";

export function PostDate() {
  const createdAt = usePostStore((s) => s.createdAt);

  return (
    <span className="text-muted-foreground ml-auto text-xs">
      {new Date(createdAt).toLocaleDateString()}
    </span>
  );
}
