import type { NextConfig } from "next";

import { env } from "~/env";

const config: NextConfig = {
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
    localPatterns: [
      {
        pathname: "/src/assets/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  reactCompiler: true,
};

export default config;
