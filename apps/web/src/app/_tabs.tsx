import type { LucideIcon } from "lucide-react";
import {
  createFileRoute,
  Link,
  linkOptions,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Bell, Home, PlusIcon, Search, UserRound } from "lucide-react";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import * as HoverCard from "@acme/ui/hover-card";

import { useAuthStore } from "~/features/auth/store";
import { SmallProfilePreview } from "~/features/profile/molecules/small-profile-preview";
import { ThemeToggle } from "~/features/theme/atoms/theme-toggle";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
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
  const myUsername = useAuthStore((s) => s.myProfile?.username);
  const imSignedIn = useAuthStore((s) => s.imSignedIn);

  const tabs = linkOptions([
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
      params: { username: myUsername ?? "my-profile" },
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
            <Link to={tab.to} aria-label={tab.label} key={tab.to}>
              <TabBarSlot>
                <tab.children />
              </TabBarSlot>
            </Link>
          );
        }

        if (tab.to === "/$username") {
          return (
            <HoverCard.Container openDelay={0} closeDelay={200} key={tab.to}>
              <HoverCard.Trigger asChild>
                <Link to={tab.to} params={tab.params} aria-label={tab.label}>
                  <TabBarSlot>
                    <tab.children
                      isActive={
                        myUsername !== undefined &&
                        pathname === `/${tab.params.username}`
                      }
                    />
                  </TabBarSlot>
                </Link>
              </HoverCard.Trigger>
              <HoverCard.Content
                className={cn(
                  "flex flex-col items-start",
                  imSignedIn && "px-6! pt-5 pb-3!",
                  !imSignedIn && "px-4 py-2 pt-3",
                )}
              >
                <SmallProfilePreview />
                <ThemeToggle />
              </HoverCard.Content>
            </HoverCard.Container>
          );
        }

        return (
          <Link to={tab.to} aria-label={tab.label} key={tab.to}>
            <TabBarSlot>
              <tab.children isActive={pathname === tab.to} />
            </TabBarSlot>
          </Link>
        );
      })}
    </div>
  );
}
