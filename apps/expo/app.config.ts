import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Ruby",
  slug: "ruby",
  scheme: "ruby",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/ruby.icon",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.directedbyshawn.rubyapp",
    supportsTablet: true,
    icon: "./assets/ruby.icon",
  },
  android: {
    package: "com.directedbyshawn.rubyapp",
    edgeToEdgeEnabled: true,
  },
  extra: {
    eas: {
      projectId: "b04e9670-d3a9-4186-aeab-dc61c8b07553",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCanary: true,
    reactCompiler: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#E4E4E7",
        image: "./assets/ruby.icon",
        dark: {
          backgroundColor: "#18181B",
          image: "./assets/ruby.icon",
        },
      },
    ],
  ],
});
