import type { LegendListRenderItemProps } from "@legendapp/list";
import { useLayoutEffect, useRef, useState } from "react";
import { LegendList } from "@legendapp/list";
import { Loader } from "lucide-react";

import type { UIProfile } from "@acme/convex/types";

import { QuickLink } from "~/components/quick-link";
import { Name } from "~/features/profile/atoms/name";
import { PFP } from "~/features/profile/atoms/pfp";
import { Username } from "~/features/profile/atoms/username";
import { ProfileStore } from "~/features/profile/store";
import { useSearchResults } from "../hooks/use-search-results";
import { SearchBar } from "./search-bar";

export function SearchPageResults() {
  const { results, resultsStatus, loadingStatus, loadMoreItems } =
    useSearchResults();

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

  return (
    <div className="max-w-auto mx-auto flex h-screen flex-col gap-4 overflow-hidden px-4 pt-8 sm:max-w-md sm:pt-12 lg:max-w-xl">
      <SearchBar />
      <div className="min-h-0 flex-1" ref={containerRef}>
        <LegendList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
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
    </div>
  );
}

function renderItem(props: LegendListRenderItemProps<UIProfile>) {
  return <ProfileSearchItem {...props} />;
}

function keyExtractor(profile: UIProfile) {
  return profile.username;
}

function ProfileSearchItem({ item }: LegendListRenderItemProps<UIProfile>) {
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
