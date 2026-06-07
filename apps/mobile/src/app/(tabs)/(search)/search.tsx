import type { LegendListRenderItemProps } from "@legendapp/list";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";

import type { UIProfile } from "@acme/convex/profile/types";

import { LoadingSpinner } from "~/components/loading-spinner";
import { SafeAreaView } from "~/components/safe-area-view";
import { ProfileSearchItem } from "~/features/profile/components/profile-search-item";
import { ClearButton } from "~/features/search/components/search-bar/clear-button";
import { Container } from "~/features/search/components/search-bar/container";
import { Icon } from "~/features/search/components/search-bar/icon";
import { Input } from "~/features/search/components/search-bar/input";
import { useSearchResults } from "~/features/search/hooks/use-search-results";
import { SearchStore } from "~/features/search/store";

export default function SearchPage() {
  return (
    <SearchStore>
      <View className="relative flex-1">
        <SearchPageResults />
        <SearchBar />
      </View>
    </SearchStore>
  );
}

function SearchBar() {
  return (
    <SafeAreaView className="absolute top-0 right-0 left-0 z-10">
      <Container className="mx-4 mt-3">
        <Icon />
        <Input />
        <ClearButton />
      </Container>
    </SafeAreaView>
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
        paddingBottom: insets.bottom + 96,
      }}
      recycleItems={true}
      ListHeaderComponent={<View style={{ height: insets.top + 64 }} />}
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
