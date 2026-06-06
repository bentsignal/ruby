import { createUrls } from "@acme/config/urls";

export const urls = createUrls({
  nodeEnv: __DEV__ ? "development" : "production",
});
