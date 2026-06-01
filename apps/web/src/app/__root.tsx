import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { convert } from "great-time";

import { cn } from "@acme/std/cn";
import { Toaster } from "@acme/ui-web/toast";

import type { RouterContext } from "~/router";
import appStyles from "~/app/styles.css?url";
import { env } from "~/env";
import { getAuth } from "~/features/auth/lib/auth.functions";
import { authClient } from "~/features/auth/lib/client";
import { AuthStore } from "~/features/auth/store";
import { ThemeStore } from "~/features/theme/store";
import { getTheme } from "~/features/theme/utils";

const getThemeFromCookie = createServerFn({ method: "GET" }).handler(() => {
  const themeCookie = getCookie("theme");
  return getTheme(themeCookie);
});

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [{ rel: "stylesheet", href: appStyles }],
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
    const [token, theme] = await Promise.all([
      context.queryClient.fetchQuery({
        queryKey: ["auth-token"],
        queryFn: async () => (await getAuth()) ?? null,
        staleTime: convert(10, "minutes", "to ms"),
        gcTime: Infinity,
      }),
      context.queryClient.fetchQuery({
        queryKey: ["theme"],
        queryFn: async () => await getThemeFromCookie(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
    ]);

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
  const context = Route.useRouteContext({
    select: ({ convex, queryClient, theme, token }) => ({
      convex,
      queryClient,
      theme,
      token,
    }),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* <ReactScan /> */}
      </head>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
        )}
      >
        <ConvexBetterAuthProvider
          client={context.convex}
          authClient={authClient}
          initialToken={context.token}
        >
          <QueryClientProvider client={context.queryClient}>
            <ThemeStore
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
              initialTheme={context.theme}
            >
              <AuthStore>
                <Outlet />
                <TanStackDevtools
                  config={{
                    position: "bottom-right",
                  }}
                  plugins={[
                    {
                      name: "react-router",
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                  ]}
                />
              </AuthStore>
              <Toaster />
            </ThemeStore>
            <Scripts />
          </QueryClientProvider>
        </ConvexBetterAuthProvider>
      </body>
    </html>
  );
}

export function ReactScan() {
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
