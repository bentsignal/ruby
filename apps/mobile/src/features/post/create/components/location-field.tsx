import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MapPin, X } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { useCreateStore } from "../store";
import { LocationSearchSheet } from "./location-search-sheet";

export function LocationField() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useCreateStore((store) => store.location);
  const clearLocation = useCreateStore((store) => store.clearLocation);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");

  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Location</Text>
      {location ? (
        <View className="bg-card border-border min-h-14 flex-row items-center gap-3 rounded-lg border px-3 py-2">
          <Pressable
            className="min-w-0 flex-1 flex-row items-center gap-3"
            onPress={() => setIsSearchOpen(true)}
          >
            <View className="bg-secondary size-9 items-center justify-center rounded-full">
              <MapPin color={foreground} size={16} />
            </View>
            <View className="min-w-0 flex-1">
              <Text
                className="text-foreground text-sm font-bold"
                numberOfLines={1}
              >
                {location.name}
              </Text>
              {location.formattedAddress ? (
                <Text
                  className="text-muted-foreground text-xs"
                  numberOfLines={1}
                >
                  {location.formattedAddress}
                </Text>
              ) : null}
            </View>
          </Pressable>
          <Pressable
            accessibilityLabel="Remove location"
            className="size-9 items-center justify-center rounded-full"
            hitSlop={8}
            onPress={clearLocation}
          >
            <X color={mutedForeground} size={18} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          className="bg-card border-border min-h-12 flex-row items-center gap-3 rounded-lg border px-3"
          onPress={() => setIsSearchOpen(true)}
        >
          <MapPin color={foreground} size={18} />
          <Text className="text-foreground text-sm font-bold">
            Add location
          </Text>
        </Pressable>
      )}
      <LocationSearchSheet
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />
    </View>
  );
}
