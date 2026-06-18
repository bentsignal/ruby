import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MapPin, X } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { LocationSearchSheet } from "../location-search/location-search-sheet";
import { useCreateStore } from "../store";

export function LocationField() {
  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Location</Text>
      <LocationPicker />
    </View>
  );
}

function LocationPicker() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useCreateStore((store) => store.location);
  const clearLocation = useCreateStore((store) => store.clearLocation);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");

  function openSearch() {
    setIsSearchOpen(true);
  }

  if (!location) {
    return (
      <LocationPickerFrame
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      >
        <Pressable
          className="bg-card border-border min-h-12 flex-row items-center gap-3 rounded-lg border px-3"
          onPress={openSearch}
        >
          <MapPin color={foreground} size={18} />
          <Text className="text-foreground text-sm font-bold">
            Add location
          </Text>
        </Pressable>
      </LocationPickerFrame>
    );
  }

  return (
    <LocationPickerFrame
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
    >
      <View className="bg-card border-border min-h-14 flex-row items-center gap-3 rounded-lg border px-3 py-2">
        <Pressable
          className="min-w-0 flex-1 flex-row items-center gap-3"
          onPress={openSearch}
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
            <LocationAddress address={location.formattedAddress} />
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
    </LocationPickerFrame>
  );
}

function LocationPickerFrame({
  children,
  isSearchOpen,
  setIsSearchOpen,
}: {
  children: React.ReactNode;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}) {
  return (
    <>
      {children}
      {isSearchOpen ? (
        <LocationSearchSheet
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
        />
      ) : null}
    </>
  );
}

function LocationAddress({ address }: { address?: string }) {
  if (!address) {
    return null;
  }

  return (
    <Text className="text-muted-foreground text-xs" numberOfLines={1}>
      {address}
    </Text>
  );
}
