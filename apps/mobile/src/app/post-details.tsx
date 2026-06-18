import { Linking, Platform, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CalendarDays, MapPin } from "lucide-react-native";

import { androidGeoUrl, appleMapsUrl, googleMapsWebUrl } from "@acme/std/maps";

import { SafeAreaView } from "~/components/safe-area-view";
import { useColor } from "~/hooks/use-color";

function formatFullDate(timestamp: number) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function parseCoordinate(value?: string) {
  if (!value) return undefined;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

function optionalParam(value?: string) {
  return value === "" ? undefined : value;
}

function buildLocation({
  formattedAddress,
  googlePlaceId,
  latitude,
  locationName,
  longitude,
}: {
  formattedAddress?: string;
  googlePlaceId?: string;
  latitude?: string;
  locationName?: string;
  longitude?: string;
}) {
  const parsedLatitude = parseCoordinate(latitude);
  if (!locationName && !formattedAddress && parsedLatitude === undefined)
    return null;

  return {
    formattedAddress: optionalParam(formattedAddress),
    googlePlaceId: optionalParam(googlePlaceId),
    latitude: parsedLatitude,
    longitude: parseCoordinate(longitude),
    name: optionalParam(locationName),
  };
}

export default function PostDetails() {
  const {
    createdAt,
    formattedAddress,
    googlePlaceId,
    latitude: latitudeParam,
    locationName,
    longitude: longitudeParam,
  } = useLocalSearchParams<{
    createdAt?: string;
    formattedAddress?: string;
    googlePlaceId?: string;
    latitude?: string;
    locationName?: string;
    longitude?: string;
  }>();
  const mutedForeground = useColor("muted-foreground");
  const secondary = useColor("secondary");

  const location = buildLocation({
    formattedAddress,
    googlePlaceId,
    latitude: latitudeParam,
    locationName,
    longitude: longitudeParam,
  });
  const locationLabel = location?.name ?? location?.formattedAddress ?? null;
  const timestamp = Number(createdAt);

  function openInMaps() {
    if (!location) return;
    const url = Platform.select({
      android: androidGeoUrl(location),
      ios: appleMapsUrl(location),
      default: googleMapsWebUrl(location),
    });
    void Linking.openURL(url).catch(() =>
      Linking.openURL(googleMapsWebUrl(location)),
    );
  }

  return (
    <SafeAreaView top={false}>
      <View className="gap-5 px-6 pt-7">
        <Text className="text-foreground text-lg font-bold">Details</Text>

        <View className="gap-3">
          <View className="flex-row items-center gap-3 py-1">
            <CalendarDays color={mutedForeground} size={20} />
            <Text className="text-foreground flex-1 text-[15px] leading-5">
              {Number.isFinite(timestamp) ? formatFullDate(timestamp) : ""}
            </Text>
          </View>

          {locationLabel && (
            <Pressable
              className="flex-row items-center gap-3 py-1"
              onPress={openInMaps}
            >
              <MapPin color={secondary} size={20} />
              <Text className="text-secondary flex-1 text-[15px] leading-5 font-semibold">
                {locationLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
