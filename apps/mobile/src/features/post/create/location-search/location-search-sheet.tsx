import { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { Search } from "lucide-react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { LocationResults } from "./components/results";
import { LocationSearchSheetStore, useLocationSearchSheetStore } from "./store";

const LOCATION_SEARCH_STORE_WRITE_DELAY_MS = 180;

export function LocationSearchSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <LocationSearchSheetStore isOpen={isOpen} onOpenChange={onOpenChange}>
      <LocationSearchModal />
    </LocationSearchSheetStore>
  );
}

function LocationSearchModal() {
  const handleOpenChange = useLocationSearchSheetStore(
    (store) => store.handleOpenChange,
  );
  const isOpen = useLocationSearchSheetStore((store) => store.isOpen);

  return (
    <Modal
      animationType="slide"
      allowSwipeDismissal={Platform.OS === "ios"}
      presentationStyle={Platform.OS === "ios" ? "formSheet" : "fullScreen"}
      visible={isOpen}
      onRequestClose={() => handleOpenChange(false)}
    >
      <SheetFrame>
        <SheetHeader />
        <LocationSearchInput />
        <LocationResults />
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

function LocationSearchInput() {
  const isOpen = useLocationSearchSheetStore((store) => store.isOpen);
  const mutedForeground = useLocationSearchSheetStore(
    (store) => store.mutedForeground,
  );
  const search = useLocationSearchSheetStore((store) => store.search);
  const setSearch = useLocationSearchSheetStore((store) => store.setSearch);
  const latestSearchRef = useRef(search);
  const storeWriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // eslint-disable-next-line no-restricted-syntax -- Clears a pending deferred store write if this native input unmounts.
  useEffect(() => {
    return () => {
      if (storeWriteTimeoutRef.current) {
        clearTimeout(storeWriteTimeoutRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line no-restricted-syntax -- Keeps the deferred native input value aligned after search sheet resets.
  useEffect(() => {
    latestSearchRef.current = search;
    if (!isOpen && storeWriteTimeoutRef.current) {
      clearTimeout(storeWriteTimeoutRef.current);
      storeWriteTimeoutRef.current = null;
    }
  }, [search, isOpen]);

  function flushSearchToStore() {
    if (storeWriteTimeoutRef.current) {
      clearTimeout(storeWriteTimeoutRef.current);
      storeWriteTimeoutRef.current = null;
    }
    setSearch(latestSearchRef.current);
  }

  function handleChangeText(nextSearch: string) {
    latestSearchRef.current = nextSearch;

    if (storeWriteTimeoutRef.current) {
      clearTimeout(storeWriteTimeoutRef.current);
    }
    storeWriteTimeoutRef.current = setTimeout(() => {
      storeWriteTimeoutRef.current = null;
      setSearch(latestSearchRef.current);
    }, LOCATION_SEARCH_STORE_WRITE_DELAY_MS);
  }

  return (
    <View className="bg-background border-border mb-3 h-12 flex-row items-center gap-3 rounded-xl border px-3">
      <Search color={mutedForeground} size={18} />
      <TextInput
        key={isOpen ? "open" : "closed"}
        autoFocus={isOpen}
        className="text-foreground min-w-0 flex-1 text-base"
        defaultValue={search}
        placeholder="Search places"
        placeholderTextColor={mutedForeground}
        returnKeyType="search"
        style={{ height: 48, lineHeight: 20, paddingVertical: 0 }}
        textAlignVertical="center"
        onBlur={flushSearchToStore}
        onChangeText={handleChangeText}
        onSubmitEditing={flushSearchToStore}
      />
    </View>
  );
}
