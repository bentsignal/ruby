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

export function LocationSearchSheet({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <LocationSearchSheetStore isOpen={isOpen} onOpenChange={onOpenChange}>
      <LocationSearchModal isOpen={isOpen} />
    </LocationSearchSheetStore>
  );
}

function LocationSearchModal({ isOpen }: { isOpen: boolean }) {
  const handleOpenChange = useLocationSearchSheetStore(
    (store) => store.handleOpenChange,
  );

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
  const mutedForeground = useLocationSearchSheetStore(
    (store) => store.mutedForeground,
  );
  const search = useLocationSearchSheetStore((store) => store.search);
  const setSearch = useLocationSearchSheetStore((store) => store.setSearch);

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
