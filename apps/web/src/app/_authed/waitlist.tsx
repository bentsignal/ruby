import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Check } from "lucide-react";

import { api } from "@acme/convex/api";
import { Button } from "@acme/ui-web/button";

import logo from "~/assets/logo-small.webp";
import { Image } from "~/components/image";

export const Route = createFileRoute("/_authed/waitlist")({
  component: Waitlist,
  beforeLoad: ({ context }) => {
    if (context.waitlistStatus === "has-access") {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.waitlist.queries.getMyStatus, {}),
    );
  },
});

function Waitlist() {
  const { mutate: joinWaitlist } = useMutation({
    mutationFn: useConvexMutation(
      api.waitlist.mutations.join,
    ).withOptimisticUpdate((localStore) => {
      localStore.setQuery(api.waitlist.queries.getMyStatus, {}, "on-waitlist");
    }),
  });
  const { data: isOnWaitlist } = useSuspenseQuery({
    ...convexQuery(api.waitlist.queries.getMyStatus, {}),
    select: (status) => status === "on-waitlist",
  });

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10">
      <div className="from-background via-background to-muted/40 absolute inset-0 bg-linear-to-br" />
      <div className="bg-primary/5 absolute top-[-20%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
      <section className="relative flex w-full max-w-[390px] flex-col items-center gap-6 text-center">
        <Image src={logo} alt="Ruby" className="size-16 rounded-[18px]" />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-normal">
            Coming soon...
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            Ruby is currently in development. Join the waitlist and we will let
            you in as soon as it's ready.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="h-12 min-w-52 rounded-full"
          onClick={() => joinWaitlist({})}
          disabled={isOnWaitlist}
        >
          <WaitlistButtonContent isOnWaitlist={isOnWaitlist} />
        </Button>
      </section>
    </main>
  );
}

function WaitlistButtonContent({ isOnWaitlist }: { isOnWaitlist: boolean }) {
  if (!isOnWaitlist) return "Join the waitlist";

  return (
    <>
      <Check />
      You're on the list
    </>
  );
}
