import { useRouteContext } from "@tanstack/react-router";

import { QuickLink } from "~/components/quick-link";
import { cn } from "~/utils/style-utils";
import { Name } from "../atoms/name";
import { PFP } from "../atoms/pfp";
import { Username } from "../atoms/username";
import { ProfileStore } from "../store";

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
