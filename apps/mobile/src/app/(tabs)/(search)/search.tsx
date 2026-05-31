import type { LegendListRenderItemProps } from "@legendapp/list";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { UIProfile } from "@acme/convex/types";

import { LoadingSpinner } from "~/components/loading-spinner";
import { SafeAreaView } from "~/components/safe-area-view";
import { ProfileSearchItem } from "~/features/profile/components/profile-search-item";
import { SearchClearButton } from "~/features/search/components/search-clear-button";
import { SearchContainer } from "~/features/search/components/search-container";
import { SearchIcon } from "~/features/search/components/search-icon";
import { SearchInput } from "~/features/search/components/search-input";
import { useSearchResults } from "~/features/search/hooks/use-search-results";
import { SearchStore } from "~/features/search/store";

export default function SearchPage() {
  return (
    <SearchStore>
      <View className="relative flex-1">
        <SearchPageResults />
        <SearchContainer className="absolute bottom-0 left-0 mx-4 mb-4">
          <SearchIcon />
          <SearchInput />
          <SearchClearButton />
        </SearchContainer>
      </View>
    </SearchStore>
  );
}

function SearchPageResults() {
  const insets = useSafeAreaInsets();

  const { results, resultsStatus, loadingStatus, loadMoreItems } =
    useSearchResults();

  if (resultsStatus === "no-search-term-entered") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">
          Search for other users on Ruby
        </Text>
      </SafeAreaView>
    );
  }

  if (resultsStatus === "no-results-found") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">No users found</Text>
      </SafeAreaView>
    );
  }

  const showLoadingSpinner =
    ["CanLoadMore", "LoadingFirstPage"].includes(loadingStatus) &&
    results.length > 15;

  return (
    <LegendList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.75}
      maintainVisibleContentPosition={true}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 36,
      }}
      recycleItems={true}
      ListHeaderComponent={<View style={{ height: insets.top }} />}
      ListFooterComponent={
        showLoadingSpinner ? (
          <View className="my-2 h-10 w-full items-center justify-center">
            <LoadingSpinner />
          </View>
        ) : null
      }
    />
  );
}

function renderItem(props: LegendListRenderItemProps<UIProfile>) {
  return <ProfileSearchItem {...props} />;
}

function keyExtractor(profile: UIProfile) {
  return profile.username;
}
