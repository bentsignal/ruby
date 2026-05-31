import { SearchIcon as SearchIconBase } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";

export function SearchIcon({ className }: { className?: string }) {
  const sidebarForeground = useColor("sidebar-foreground");
  return (
    <SearchIconBase size={16} color={sidebarForeground} className={className} />
  );
}
