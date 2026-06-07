import { useEffect, useState } from "react";
import { usePaginatedQuery } from "convex/react";

import type { UIProfile } from "@acme/convex/profile/types";
import { api } from "@acme/convex/api";

import { useSearchStore } from "~/features/search/store";

const PAGE_SIZE = 25;

function useSearchResults() {
  const searchTerm = useSearchStore((s) => s.searchTerm.trim());
  const debouncedSearchTerm = useSearchStore((s) =>
    s.debouncedSearchTerm.trim(),
  );

  const {
    results: paginatedResults,
    status: loadingStatus,
    loadMore,
  } = usePaginatedQuery(
    api.profile.queries.search,
    debouncedSearchTerm.length > 0
      ? { searchTerm: debouncedSearchTerm }
      : "skip",
    { initialNumItems: PAGE_SIZE },
  );

  const [results, setResults] = useState<UIProfile[]>([]);

  // eslint-disable-next-line no-restricted-syntax -- Keeps the visible results stable while the paginated query refreshes.
  useEffect(() => {
    if (searchTerm.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    if (debouncedSearchTerm.length === 0) return;
    if (loadingStatus === "LoadingFirstPage") return;
    setResults(paginatedResults);
  }, [debouncedSearchTerm, paginatedResults, loadingStatus, searchTerm]);

  const idle = loadingStatus === "CanLoadMore" || loadingStatus === "Exhausted";

  const resultsStatus =
    searchTerm.length > 0 && paginatedResults.length === 0 && idle
      ? "no-results-found"
      : searchTerm.length === 0
        ? "no-search-term-entered"
        : "results-found";

  function loadMoreItems() {
    if (loadingStatus === "CanLoadMore") {
      loadMore(PAGE_SIZE);
    }
  }

  return { results, resultsStatus, loadingStatus, loadMoreItems };
}

export { useSearchResults };
