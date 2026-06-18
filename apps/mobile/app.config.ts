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
    package: "com.ruby.rubyapp",
    icon: "./assets/rounded-icon.png",
  },
  extra: {
    eas: {
      projectId: "b04e9670-d3a9-4186-aeab-dc61c8b07553",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCompiler: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    "expo-system-ui",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "16.4",
          usePrecompiledModules: false,
        },
      },
    ],
    "./expo-plugins/with-ios-scene-lifecycle.cjs",
    "./expo-plugins/with-ios-pods-deployment-target.cjs",
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow Ruby to access your photos so you can share travel updates.",
      },
    ],
    "./expo-plugins/with-android-user-certs.cjs",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffe3e0",
        image: "./assets/rounded-icon.png",
        dark: {
          backgroundColor: "#1e1616",
          image: "./assets/rounded-icon.png",
        },
      },
    ],
  ],
});
