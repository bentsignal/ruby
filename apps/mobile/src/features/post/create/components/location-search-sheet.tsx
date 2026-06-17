import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MapPin, Search } from "lucide-react-native";

import type { LocationPrediction } from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";

import { SafeAreaView } from "~/components/safe-area-view";
import { useColor } from "~/hooks/use-color";
import { useLocationSearch } from "./location-search-state";

export function LocationSearchSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const search = useLocationSearch({ isOpen, onOpenChange });
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");

  return (
    <Modal
      animationType="slide"
      allowSwipeDismissal={Platform.OS === "ios"}
      presentationStyle={Platform.OS === "ios" ? "formSheet" : "fullScreen"}
      visible={isOpen}
      onRequestClose={() => search.handleOpenChange(false)}
    >
      <SheetFrame>
        <SheetHeader />
        <LocationSearchInput
          mutedForeground={mutedForeground}
          search={search.search}
          setSearch={search.setSearch}
        />
        <LocationResults
          foreground={foreground}
          mutedForeground={mutedForeground}
          search={search}
        />
      </SheetFrame>
    </Modal>
  );
}

function SheetFrame({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-card flex-1"
    >
      <SafeAreaView className="flex-1 px-4 pb-4" top={false} bottom>
        <View className="flex-1 pt-4">{children}</View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function SheetHeader() {
  return (
    <View className="mb-6 gap-6">
      <View className="bg-muted-foreground/30 h-1 w-11 self-center rounded-full" />
      <View>
        <Text className="text-foreground text-xl font-black">Add location</Text>
      </View>
    </View>
  );
}

function LocationSearchInput({
  mutedForeground,
  search,
  setSearch,
}: {
  mutedForeground: string;
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <View className="bg-background border-border mb-3 h-12 flex-row items-center gap-3 rounded-xl border px-3">
      <Search color={mutedForeground} size={18} />
      <TextInput
        autoFocus
        className="text-foreground min-w-0 flex-1 text-base"
        placeholder="Search places"
        placeholderTextColor={mutedForeground}
        returnKeyType="search"
        style={{ height: 48, lineHeight: 20, paddingVertical: 0 }}
        textAlignVertical="center"
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

function LocationResults({
  foreground,
  mutedForeground,
  search,
}: {
  foreground: string;
  mutedForeground: string;
  search: ReturnType<typeof useLocationSearch>;
}) {
  const showEmptyState =
    search.search.trim().length >= PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH &&
    !search.isLoading &&
    !search.searchError &&
    search.predictions.length === 0;

  return (
    <ScrollView
      className="min-h-0 flex-1"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="min-h-56 py-1"
    >
      <LocationStatus
        mutedForeground={mutedForeground}
        search={search}
        showEmptyState={showEmptyState}
      />
      {!search.isLoading && !search.searchError
        ? search.predictions.map((prediction) => (
            <PredictionRow
              key={prediction.id}
              foreground={foreground}
              prediction={prediction}
              selectPrediction={search.selectPrediction}
            />
          ))
        : null}
    </ScrollView>
  );
}

function LocationStatus({
  mutedForeground,
  search,
  showEmptyState,
}: {
  mutedForeground: string;
  search: ReturnType<typeof useLocationSearch>;
  showEmptyState: boolean;
}) {
  if (search.isLoading) {
    return (
      <View className="h-28 flex-row items-center justify-center gap-2">
        <ActivityIndicator color={mutedForeground} />
        <Text className="text-muted-foreground text-sm">Searching</Text>
      </View>
    );
  }
  if (search.searchError) {
    return (
      <View className="h-28 items-center justify-center">
        <Text className="text-destructive text-sm">{search.searchError}</Text>
      </View>
    );
  }
  if (showEmptyState) {
    return (
      <View className="h-28 items-center justify-center">
        <Text className="text-muted-foreground text-sm">
          No locations found
        </Text>
      </View>
    );
  }
  return null;
}

function PredictionRow({
  foreground,
  prediction,
  selectPrediction,
}: {
  foreground: string;
  prediction: LocationPrediction;
  selectPrediction: (prediction: LocationPrediction) => void;
}) {
  return (
    <Pressable
      className="active:bg-accent min-h-14 flex-row items-center gap-3 rounded-lg px-1 py-2"
      onPress={() => selectPrediction(prediction)}
    >
      <View className="bg-secondary size-9 items-center justify-center rounded-full">
        <MapPin color={foreground} size={16} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
          {prediction.title}
        </Text>
        {prediction.subtitle ? (
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            {prediction.subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
