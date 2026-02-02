import * as Search from "../atom";

function SearchBar({ className }: { className?: string }) {
  return (
    <Search.Container className={className}>
      <Search.Icon />
      <Search.Input />
      <Search.ClearButton />
    </Search.Container>
  );
}

export { SearchBar };
