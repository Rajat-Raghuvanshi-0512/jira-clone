import SignUpForm from "./SignUpForm";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthProviderButtons } from "./AuthProviderButtons";
import Link from "next/link";

export const SignUpCard = () => {
  return (
    <Card className="w-full -h-full max-w-md border-none shadow-none gap-2">
      <CardHeader className="flex flex-col items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600">
            Privacy Policy
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <SignUpForm />
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 space-y-4">
        <AuthProviderButtons />
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
