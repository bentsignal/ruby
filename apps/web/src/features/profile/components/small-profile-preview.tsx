import { useRouteContext } from "@tanstack/react-router";

import { QuickLink } from "~/components/quick-link";
import { cn } from "~/utils/style-utils";
import { ProfileStore } from "../store";
import { Name } from "./info/name";
import { PFP } from "./info/pfp";
import { Username } from "./info/username";

export function SmallProfilePreview({ className }: { className?: string }) {
  const myProfile = useRouteContext({
    from: "/_authed",
    select: (ctx) => ctx.profile,
  });

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <ProfileStore profile={myProfile}>
        <QuickLink
          to="/$username"
          params={{ username: myProfile.username }}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PFP variant="sm" className="cursor-pointer" />
            <div className="flex flex-col">
              <Name className="text-sm font-bold" />
              <Username className="text-muted-foreground text-sm font-semibold" />
            </div>
          </div>
        </QuickLink>
      </ProfileStore>
    </div>
  );
}
