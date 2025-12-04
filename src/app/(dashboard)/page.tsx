import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { getWorkspaces } from "@/features/workspaces/actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const workspaces = await getWorkspaces();
  if (workspaces.total === 0) {
    return redirect("/workspaces/create");
  }
  return redirect(`/workspaces/${workspaces.documents[0].$id}`);
}
