import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/actions";

interface WorkspaceSettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceSettingsPage({
  params,
}: WorkspaceSettingsPageProps) {
  const { workspaceId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const workspace = await getWorkspace(workspaceId);
  if (!workspace) {
    return redirect(`/workspaces/${workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm workspaceId={workspaceId} initialValues={workspace} />
    </div>
  );
}
