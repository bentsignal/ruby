import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { z } from "zod/v4";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toast";

import appStyles from "~/app/styles.css?url";
import { Provider as ConvexProvider } from "~/context/convex-context";
import { env } from "~/env";
import * as Auth from "~/features/auth/atom";
import { LoginModal } from "~/features/auth/molecules/login-modal";
import * as Theme from "~/features/theme/atom";
import { getTheme } from "~/features/theme/utils";
import { getAuth } from "~/lib/auth-server";

const getThemeFromCookie = createServerFn({ method: "GET" }).handler(() => {
  const themeCookie = getCookie("theme");
  return {
    theme: getTheme(themeCookie),
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  validateSearch: z.object({
    showLogin: z.boolean().optional(),
    redirectTo: z.string().optional(),
  }),
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
    const token = await getAuth();
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }

    const { theme } = await getThemeFromCookie();

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
