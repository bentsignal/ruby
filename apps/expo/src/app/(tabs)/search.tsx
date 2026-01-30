import { View } from "react-native";

import * as Search from "~/features/search/atom";
import { SearchBar } from "~/features/search/molecules/search-bar";
import { SearchPageResults } from "~/features/search/molecules/search-page-results";

export default function SearchPage() {
  return (
    <Search.Store>
      <View className="relative flex-1">
        <SearchPageResults />
        <SearchBar className="absolute bottom-0 left-0 mx-4 mb-4" />
      </View>
    </Search.Store>
  );
}
