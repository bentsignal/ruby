"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, PlusIcon, Search, UserRound } from "lucide-react";

import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import * as HoverCard from "@acme/ui/hover-card";

import * as Auth from "~/features/auth/atom";
import { SmallProfilePreview } from "~/features/profile/molecules/small-profile-preview";
import * as Theme from "~/features/theme/atom";

function TabBar() {
  const pathname = usePathname();
  const myUsername = Auth.useStore((s) => s.myProfile?.username ?? "");
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
      <TabBarLink href="/" label="Home">
        <TabBarButton>
          <Home
            size={24}
            strokeWidth={pathname === "/" ? 2.5 : 1.75}
            className={cn(
              "transition-all",
              pathname === "/" && "text-sidebar-accent-foreground",
            )}
          />
        </TabBarButton>
      </TabBarLink>
      <TabBarLink href="/search" label="Search">
        <TabBarButton>
          <Search
            size={24}
            strokeWidth={pathname === "/search" ? 2.5 : 1.75}
            className={cn(
              "transition-all",
              pathname === "/search" && "text-sidebar-accent-foreground",
            )}
          />
        </TabBarButton>
      </TabBarLink>
      <TabBarLink href="/notifications" label="Notifications">
        <TabBarButton>
          <Bell
            size={24}
            strokeWidth={pathname === "/notifications" ? 2.5 : 1.75}
            className={cn(
              "transition-all",
              pathname === "/notifications" && "text-sidebar-accent-foreground",
            )}
          />
        </TabBarButton>
      </TabBarLink>
      <HoverCard.Container openDelay={1250}>
        <HoverCard.Trigger asChild>
          <TabBarLink href={`/${myUsername}`} label="Profile">
            <TabBarButton>
              <UserRound
                size={24}
                strokeWidth={pathname === `/${myUsername}` ? 2.5 : 1.75}
                className={cn(
                  "transition-all",
                  pathname === `/${myUsername}` &&
                    "text-sidebar-accent-foreground",
                )}
              />
            </TabBarButton>
          </TabBarLink>
        </HoverCard.Trigger>
        <HoverCard.Content className="flex flex-col items-start px-6! pt-5 pb-3!">
          <SmallProfilePreview />
          <Theme.Toggle />
        </HoverCard.Content>
      </HoverCard.Container>
      <TabBarLink href="/create" label="Create">
        <div className={cn("rounded-full!", buttonVariants({ size: "icon" }))}>
          <PlusIcon size={16} />
        </div>
      </TabBarLink>
    </div>
  );
}

function TabBarButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sidebar-foreground hover:bg-sidebar-accent flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors">
      {children}
    </div>
  );
}

function TabBarLink({
  href,
  label,
  children,
  ref,
  ...props
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
}) {
  const imNotSignedIn = Auth.useStore((s) => s.imSignedOut);
  const setIsLoginModalOpen = Auth.useStore((s) => s.setIsLoginModalOpen);
  const setRedirectURL = Auth.useStore((s) => s.setRedirectURL);

  if (imNotSignedIn) {
    return (
      <button
        aria-label={label}
        onClick={() => {
          setIsLoginModalOpen(true);
          setRedirectURL(href);
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link ref={ref} href={href} aria-label={label} prefetch={true} {...props}>
      {children}
    </Link>
  );
}

export { TabBar };
