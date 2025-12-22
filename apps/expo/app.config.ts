import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Ruby",
  slug: "ruby",
  scheme: "ruby",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "rubyapp",
    supportsTablet: true,
    icon: "./assets/ruby.icon",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "rubyapp",
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
    // [
    //   "expo-splash-screen",
    //   {
    //     backgroundColor: "#1659cc",
    //     image: "./assets/ruby.icon/Assets/logo-cutout-bg.png",
    //     dark: {
    //       backgroundColor: "#1659cc",
    //       image: "./assets/ruby.icon/Assets/logo-cutout-bg.png",
    //     },
    //   },
    // ],
  ],
});
