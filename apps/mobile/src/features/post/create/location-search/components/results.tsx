import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MapPin } from "lucide-react-native";

import type { LocationPrediction } from "@acme/convex/places/types";
import { PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH } from "@acme/config/places";

import { useLocationSearchSheetStore } from "../store";

export function LocationResults() {
  return (
    <ScrollView
      className="min-h-0 flex-1"
      keyboardShouldPersistTaps="always"
      contentContainerClassName="min-h-56 py-1"
    >
      <LocationStatus />
      <PredictionRows />
    </ScrollView>
  );
}

function LocationStatus() {
  const isLoading = useLocationSearchSheetStore((store) => store.isLoading);
  const mutedForeground = useLocationSearchSheetStore(
    (store) => store.mutedForeground,
  );
  const predictions = useLocationSearchSheetStore((store) => store.predictions);
  const search = useLocationSearchSheetStore((store) => store.search);
  const searchError = useLocationSearchSheetStore((store) => store.searchError);
  const showEmptyState =
    search.trim().length >= PLACE_AUTOCOMPLETE_INPUT_MIN_LENGTH &&
    !isLoading &&
    !searchError &&
    predictions.length === 0;

  if (isLoading) {
    return (
      <View className="h-28 flex-row items-center justify-center gap-2">
        <ActivityIndicator color={mutedForeground} />
        <Text className="text-muted-foreground text-sm">Searching</Text>
      </View>
    );
  }
  if (searchError) {
    return (
      <View className="h-28 items-center justify-center">
        <Text className="text-destructive text-sm">{searchError}</Text>
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

function PredictionRows() {
  const foreground = useLocationSearchSheetStore((store) => store.foreground);
  const isLoading = useLocationSearchSheetStore((store) => store.isLoading);
  const predictions = useLocationSearchSheetStore((store) => store.predictions);
  const searchError = useLocationSearchSheetStore((store) => store.searchError);
  const selectPrediction = useLocationSearchSheetStore(
    (store) => store.selectPrediction,
  );

  if (isLoading || searchError) {
    return null;
  }

  return predictions.map((prediction) => (
    <PredictionRow
      key={prediction.id}
      foreground={foreground}
      prediction={prediction}
      selectPrediction={selectPrediction}
    />
  ));
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
        <PredictionSubtitle subtitle={prediction.subtitle} />
      </View>
    </Pressable>
  );
}

function PredictionSubtitle({ subtitle }: { subtitle?: string }) {
  if (!subtitle) {
    return null;
  }

  return (
    <Text className="text-muted-foreground text-xs" numberOfLines={1}>
      {subtitle}
    </Text>
  );
}
