import { createJiti } from "jiti";

import { env } from "~/env";

const jiti = createJiti(import.meta.url);

async function validateEnv() {
  await jiti.import("./src/env");
}

validateEnv();

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/convex"],

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.UPLOADTHING_APP_ID}.ufs.sh`,
        port: "",
        pathname: "/f/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  cacheComponents: true,
  reactCompiler: true,
};

export default config;
