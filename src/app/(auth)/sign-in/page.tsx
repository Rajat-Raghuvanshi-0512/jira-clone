import { getCurrentUser } from "@/features/auth/queries";
import { SignInCard } from "@/features/auth/components/SignInCard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SignInPage = async () => {
  const user = await getCurrentUser();
  if (user) {
    return redirect("/");
  }
  return <SignInCard />;
};

export default SignInPage;
