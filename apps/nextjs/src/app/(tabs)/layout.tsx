"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Search, UserRound } from "lucide-react";

import { cn } from "@acme/ui";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/profile", icon: UserRound, label: "Profile" },
] as const;

function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="bg-sidebar border-sidebar-border flex items-center gap-1 rounded-full border px-2 py-2 shadow-lg">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sidebar-foreground hover:bg-sidebar-accent flex size-10 items-center justify-center rounded-full transition-colors",
                isActive && "text-sidebar-accent-foreground",
              )}
              aria-label={label}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 1.75}
                className="transition-all"
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
      <TabBar />
    </div>
  );
}
