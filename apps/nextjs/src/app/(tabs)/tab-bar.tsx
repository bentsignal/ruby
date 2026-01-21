"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, PlusIcon, Search, UserRound } from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import * as HoverCard from "@acme/ui/hover-card";

import { SmallProfilePreview } from "~/features/profile/molecules/small-profile-preview";
import * as Theme from "~/features/theme/atom";

function TabBar() {
  const pathname = usePathname();
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
        <Home
          size={24}
          strokeWidth={pathname === "/" ? 2.5 : 1.75}
          className="transition-all"
        />
      </TabBarLink>
      <TabBarLink href="/search" label="Search">
        <Search
          size={24}
          strokeWidth={pathname === "/search" ? 2.5 : 1.75}
          className="transition-all"
        />
      </TabBarLink>
      <TabBarLink href="/notifications" label="Notifications">
        <Bell
          size={24}
          strokeWidth={pathname === "/notifications" ? 2.5 : 1.75}
          className="transition-all"
        />
      </TabBarLink>
      <HoverCard.Container>
        <HoverCard.Trigger asChild>
          <TabBarLink href="/profile" label="Profile">
            <UserRound
              size={24}
              strokeWidth={pathname === "/profile" ? 2.5 : 1.75}
              className="transition-all"
            />
          </TabBarLink>
        </HoverCard.Trigger>
        <HoverCard.Content className="flex w-auto! flex-col items-start">
          <SmallProfilePreview />
          <Theme.Toggle />
        </HoverCard.Content>
      </HoverCard.Container>
      <Button size="icon" className="rounded-full">
        <PlusIcon size={24} />
      </Button>
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
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent flex size-10 items-center justify-center rounded-full transition-colors",
        isActive && "text-sidebar-accent-foreground",
      )}
      aria-label={label}
      prefetch={true}
      {...props}
    >
      {children}
    </Link>
  );
}

export { TabBar };
