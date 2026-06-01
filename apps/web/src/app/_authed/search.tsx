import type { LegendListRenderItemProps } from "@legendapp/list/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LegendList } from "@legendapp/list/react";
import { usePaginatedQuery } from "convex/react";
import { Loader } from "lucide-react";
import { z } from "zod/v4";

import type { UIProfile } from "@acme/convex/types";
import { api } from "@acme/convex/api";

import { QuickLink } from "~/components/quick-link";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";
import { ClearButton } from "~/features/search/components/search-bar/clear-button";
import { Container } from "~/features/search/components/search-bar/container";
import { Icon } from "~/features/search/components/search-bar/icon";
import { Input } from "~/features/search/components/search-bar/input";
import { SearchStore, useSearchStore } from "~/features/search/store";

const PAGE_SIZE = 25;

export const Route = createFileRoute("/_authed/search")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  component: SearchPage,
});

function SearchPage() {
  const q = Route.useSearch({ select: (s) => s.q });

  return (
    <SearchStore initialSearchTerm={q} storeSearchTermInURL={true}>
      <div className="max-w-auto mx-auto flex h-screen flex-col gap-4 overflow-hidden px-4 pt-8 sm:max-w-md sm:pt-12 lg:max-w-xl">
        <SearchBar />
        <SearchResults />
      </div>
    </SearchStore>
  );
}

function SearchBar() {
  return (
    <Container>
      <Icon />
      <Input />
      <ClearButton />
    </Container>
  );
}

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
    api.profile.search,
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

  const showLoadingSpinner =
    ["CanLoadMore", "LoadingFirstPage"].includes(loadingStatus) &&
    results.length > 15;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function updateHeight(element: HTMLDivElement) {
      setContainerHeight(element.clientHeight);
    }
    updateHeight(container);
    const observer = new ResizeObserver(() => updateHeight(container));
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    results,
    resultsStatus,
    showLoadingSpinner,
    loadMoreItems,
    containerRef,
    containerHeight,
  };
}

export function SearchResults() {
  const {
    results,
    resultsStatus,
    showLoadingSpinner,
    loadMoreItems,
    containerRef,
    containerHeight,
  } = useSearchResults();

  return (
    <div className="min-h-0 flex-1" ref={containerRef}>
      <LegendList
        data={results}
        renderItem={(props) => <SearchResultItem {...props} />}
        keyExtractor={(profile) => profile.username}
        maintainVisibleContentPosition={true}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.75}
        recycleItems={true}
        style={{
          height: containerHeight,
        }}
        contentContainerStyle={{
          paddingTop: 16,
          flex: 1,
        }}
        ListEmptyComponent={
          resultsStatus === "no-search-term-entered" ? (
            <div className="flex flex-1 items-center justify-center py-4">
              <p className="text-muted-foreground">
                Search for other users on Ruby
              </p>
            </div>
          ) : resultsStatus === "no-results-found" ? (
            <div className="flex flex-1 items-center justify-center py-4">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : null
        }
        ListFooterComponent={
          showLoadingSpinner ? (
            <div className="my-2 flex h-10 w-full items-center justify-center">
              <Loader className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="my-4 mb-36 flex w-full items-center justify-center" />
          )
        }
      />
    </div>
  );
}

function SearchResultItem({ item }: LegendListRenderItemProps<UIProfile>) {
  return (
    <ProfileStore profile={item}>
      <QuickLink
        to="/$username"
        params={{ username: item.username }}
        className="hover:bg-muted/50 flex items-center gap-3 rounded-full px-4 py-3"
      >
        <PFP variant="sm" />
        <div className="flex flex-col">
          <Name className="text-base font-medium" />
          <Username className="text-sm" />
        </div>
      </QuickLink>
    </ProfileStore>
  );
}
