import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import { getWorkspaceInfo } from '@/features/workspaces/queries'
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form'

interface JoinWorkspacePageProps {
  params: Promise<{ workspaceId: string; inviteCode: string }>
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const { workspaceId, inviteCode } = await params
  const user = await getCurrentUser()
  if (!user) {
    return redirect('/sign-in')
  }
  const workspaceInfo = await getWorkspaceInfo(workspaceId)
  if (!workspaceInfo) {
    return redirect(`/`)
  }
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        inviteCode={inviteCode}
        workspaceId={workspaceId}
        initialValues={workspaceInfo}
      />
    </div>
  )
}

export default JoinWorkspacePage
