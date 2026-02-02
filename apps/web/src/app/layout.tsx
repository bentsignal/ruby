import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { cookies } from "next/headers";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toast";

import { Provider as ConvexProvider } from "~/context/convex-context";
import { env } from "~/env";
import * as Auth from "~/features/auth/atom";
import { LoginModal } from "~/features/auth/molecules/login-modal";
import * as Theme from "~/features/theme/atom";
import { getTheme } from "~/features/theme/utils";
import { isAuthenticated } from "~/lib/auth-server";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://ruby.travel"
      : "http://localhost:3000",
  ),
  title: "Ruby",
  description: "A place to share your adventures.",
  // TODO: add metadata & OG
  // openGraph: {
  //   title: "Create T3 Turbo",
  //   description: "Simple monorepo with shared backend for web & mobile apps",
  //   url: "https://create-t3-turbo.vercel.app",
  //   siteName: "Create T3 Turbo",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@jullerino",
  //   creator: "@jullerino",
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["500"],
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticatedServerSide = await isAuthenticated();

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = getTheme(themeCookie?.value);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ReactScan />
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          roboto.variable,
        )}
      >
        <Theme.Store
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          initialTheme={theme}
        >
          <ConvexProvider>
            <Auth.Store isAuthenticatedServerSide={isAuthenticatedServerSide}>
              {children}
              <LoginModal />
            </Auth.Store>
          </ConvexProvider>
          <Toaster />
        </Theme.Store>
      </body>
    </html>
  );
}

const ReactScan = () => {
  if (env.NODE_ENV !== "development") {
    return null;
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
    </>
  );
};
