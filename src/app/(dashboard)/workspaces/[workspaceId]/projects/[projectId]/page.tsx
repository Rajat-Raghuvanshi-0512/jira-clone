import { PencilIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/features/auth/queries'
import { getProject } from '@/features/projects/queries'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'
import Link from 'next/link'

interface ProjectPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { workspaceId, projectId } = await params
  const user = await getCurrentUser()
  if (!user) {
    return redirect('/sign-in')
  }
  const project = await getProject(projectId)
  if (!project) {
    throw new Error('Project not found')
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-10"
          />
          <h1 className="text-2xl font-bold capitalize">{project.name}</h1>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
