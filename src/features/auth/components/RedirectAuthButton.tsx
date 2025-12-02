"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const RedirectAuthButton = () => {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";

  if (isSignUp) {
    return (
      <Button variant="secondary" asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button variant="secondary" asChild>
      <Link href="/sign-up">Sign up</Link>
    </Button>
  );
};
