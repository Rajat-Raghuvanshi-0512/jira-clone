import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return <div>WorkspacePage</div>;
}
