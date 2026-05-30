import type { LucideIcon } from "lucide-react";
import { queryOptions } from "@tanstack/react-query";
import {
  createFileRoute,
  linkOptions,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { convert } from "great-time";
import { Bell, Home, PlusIcon, Search, UserRound } from "lucide-react";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import * as HoverCard from "@acme/ui/hover-card";

import { QuickLink } from "~/components/quick-link";
import { SignOutLink } from "~/features/auth/atoms/sign-out-link";
import { ensureProfileExists } from "~/features/auth/lib/auth.functions";
import { SmallProfilePreview } from "~/features/profile/molecules/small-profile-preview";
import { ThemeToggle } from "~/features/theme/atoms/theme-toggle";

const profileEnsureQuery = queryOptions({
  queryKey: ["auth", "profile"],
  queryFn: async () => await ensureProfileExists(),
  staleTime: convert(50, "minutes", "to ms"),
  gcTime: Infinity,
});

export const Route = createFileRoute("/_authed")({
  component: TabsLayout,
  beforeLoad: async ({ location, context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect_uri: location.pathname },
      });
    }
    const profile =
      await context.queryClient.ensureQueryData(profileEnsureQuery);
    return {
      isAuthenticated: true,
      profile,
    };
  },
});

function TabsLayout() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  );
}

function TabBarIcon({
  Icon,
  isActive,
}: {
  Icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <Icon
      size={24}
      strokeWidth={isActive ? 2.5 : 1.75}
      className={cn(
        "transition-all",
        isActive && "text-sidebar-accent-foreground",
      )}
    />
  );
}

function TabBarSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sidebar-foreground hover:bg-sidebar-accent flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors">
      {children}
    </div>
  );
}

function TabBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const myUsername = Route.useRouteContext({
    select: (ctx) => ctx.profile.username,
  });
  const tabs = getTabs(myUsername);

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "bg-sidebar/80 border-sidebar-border border",
        "rounded-full px-3 py-2",
        "shadow-lg backdrop-blur-sm",
      )}
    >
      {tabs.map((tab) => {
        if (tab.to === "/create") {
          return (
            <QuickLink to={tab.to} aria-label={tab.label} key={tab.to}>
              <TabBarSlot>
                <tab.children />
              </TabBarSlot>
            </QuickLink>
          );
        }

        if (tab.to === "/$username") {
          return (
            <HoverCard.Container openDelay={500} closeDelay={200} key={tab.to}>
              <HoverCard.Trigger asChild>
                <QuickLink
                  to={tab.to}
                  params={tab.params}
                  aria-label={tab.label}
                >
                  <TabBarSlot>
                    <tab.children
                      isActive={pathname === `/${tab.params.username}`}
                    />
                  </TabBarSlot>
                </QuickLink>
              </HoverCard.Trigger>
              <HoverCard.Content className="flex flex-col items-start px-6! pt-5 pb-3!">
                <SmallProfilePreview className="mb-2" />
                <SignOutLink />
                <ThemeToggle />
              </HoverCard.Content>
            </HoverCard.Container>
          );
        }

        return (
          <QuickLink to={tab.to} aria-label={tab.label} key={tab.to}>
            <TabBarSlot>
              <tab.children isActive={pathname === tab.to} />
            </TabBarSlot>
          </QuickLink>
        );
      })}
    </div>
  );
}

function getTabs(myUsername: string) {
  return linkOptions([
    {
      to: "/",
      label: "Home",
      children: ({ isActive }: { isActive: boolean }) => (
        <TabBarIcon Icon={Home} isActive={isActive} />
      ),
    },
    {
      to: "/search",
      label: "Search",
      children: ({ isActive }: { isActive: boolean }) => (
        <TabBarIcon Icon={Search} isActive={isActive} />
      ),
    },
    {
      to: "/notifications",
      label: "Notifications",
      children: ({ isActive }: { isActive: boolean }) => (
        <TabBarIcon Icon={Bell} isActive={isActive} />
      ),
    },
    {
      to: "/$username",
      params: { username: myUsername },
      label: "Profile",
      children: ({ isActive }: { isActive: boolean }) => (
        <TabBarIcon Icon={UserRound} isActive={isActive} />
      ),
    },
    {
      to: "/create",
      label: "Create",
      children: () => (
        <div className={cn("rounded-full!", buttonVariants({ size: "icon" }))}>
          <PlusIcon size={16} />
        </div>
      ),
    },
  ]);
}
