import type { LegendListRenderItemProps } from "@legendapp/list";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LegendList } from "@legendapp/list";
import { Loader } from "lucide-react";

import type { UIProfile } from "@acme/convex/types";

import { Name } from "~/features/profile/atoms/name";
import { PFP } from "~/features/profile/atoms/pfp";
import { Username } from "~/features/profile/atoms/username";
import { ProfileStore } from "~/features/profile/store";
import { MainLayout } from "~/layouts/main";
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
    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <MainLayout className="flex h-screen flex-col overflow-hidden">
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
    </MainLayout>
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
      <Link
        to="/$username"
        params={{ username: item.username }}
        className="hover:bg-muted/50 flex items-center gap-3 rounded-full px-4 py-3"
      >
        <PFP variant="sm" />
        <div className="flex flex-col">
          <Name className="text-base font-medium" />
          <Username className="text-sm" />
        </div>
      </Link>
    </ProfileStore>
  );
}
