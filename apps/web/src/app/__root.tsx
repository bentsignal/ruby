import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { z } from "zod/v4";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/roboto/500.css";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toast";

import { Provider as ConvexProvider } from "~/context/convex-context";
import { env } from "~/env";
import * as Auth from "~/features/auth/atom";
import { LoginModal } from "~/features/auth/molecules/login-modal";
import * as Theme from "~/features/theme/atom";
import { getTheme } from "~/features/theme/utils";
import { getAuth } from "~/lib/auth-server";

import "~/app/styles.css";

const getServerData = createServerFn({ method: "GET" }).handler(() => {
  const themeCookie = getCookie("theme");
  return {
    theme: getTheme(themeCookie),
  };
});

const rootSearchSchema = z.object({
  showLogin: z.string().optional(),
  redirectTo: z.string().optional(),
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  validateSearch: rootSearchSchema,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ruby" },
      { name: "description", content: "A place to share your adventures." },
      {
        name: "theme-color",
        content: "white",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "black",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const token = await getAuth();
    const { theme } = await getServerData();

    // During SSR only (the only time serverHttpClient exists),
    // set the auth token to make HTTP queries with.
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    return {
      isAuthenticated: !!token,
      token,
      theme,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, theme } = Route.useRouteContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ReactScan />
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
        )}
        style={
          {
            "--font-geist-sans": "'Geist Variable', sans-serif",
            "--font-geist-mono": "'Geist Mono Variable', monospace",
            "--font-roboto": "'Roboto', sans-serif",
          } as React.CSSProperties
        }
      >
        <Theme.Store
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          initialTheme={theme}
        >
          <ConvexProvider>
            <Auth.Store isAuthenticatedServerSide={isAuthenticated}>
              <Outlet />
              <LoginModal />
            </Auth.Store>
          </ConvexProvider>
          <Toaster />
        </Theme.Store>
        <Scripts />
      </body>
    </html>
  );
}

function ReactScan() {
  if (env.VITE_NODE_ENV !== "development") {
    return null;
  }
  return (
    <script
      crossOrigin="anonymous"
      src="//unpkg.com/react-scan/dist/auto.global.js"
    />
  );
}
