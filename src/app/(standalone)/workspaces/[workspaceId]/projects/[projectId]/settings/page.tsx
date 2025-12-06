import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/queries'
import { getProject } from '@/features/projects/queries'
import { EditProjectForm } from '@/features/projects/components/edit-project-form'

interface ProjectSettingsPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>
}

const ProjectSettingsPage = async ({ params }: ProjectSettingsPageProps) => {
  const { workspaceId, projectId } = await params
  const user = await getCurrentUser()
  if (!user) {
    return redirect('/sign-in')
  }
  const project = await getProject(projectId)
  if (!project) {
    return redirect(`/workspaces/${workspaceId}/projects/${projectId}`)
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm
        projectId={projectId}
        initialValues={project}
        workspaceId={workspaceId}
      />
    </div>
  )
}

export default ProjectSettingsPage
