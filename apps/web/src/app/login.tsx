import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import logo from "~/assets/logo-small.webp";
import { Image } from "~/components/image";
import { SignInButton } from "~/features/auth/components/sign-in-button";
import { useAuthStore } from "~/features/auth/store";

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: z.object({
    redirect_uri: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function Login() {
  const imLoggedIn = useAuthStore((s) => s.imSignedIn);
  if (imLoggedIn) {
    return null;
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-10">
      <div className="from-background via-background to-muted/40 absolute inset-0 bg-linear-to-br" />
      <div className="bg-primary/5 absolute top-[-20%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
      <section className="relative flex w-full max-w-[340px] flex-col items-center">
        <Image src={logo} alt="Ruby" className="size-16 rounded-[18px]" />
        <SignInButton />
        <p className="text-muted-foreground mt-3 w-56 text-center text-sm leading-6">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </section>
    </main>
  );
}
