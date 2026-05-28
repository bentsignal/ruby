import { createUrls } from "@acme/app-config/urls";

export const urls = createUrls({
  nodeEnv: __DEV__ ? "development" : "production",
});
