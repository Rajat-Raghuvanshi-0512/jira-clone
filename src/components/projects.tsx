'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { RiAddCircleFill } from 'react-icons/ri'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'
import { ProjectAvatar } from '@/features/projects/components/project-avatar'

export const Projects = () => {
  const workspaceId = useWorkspaceId()
  const pathname = usePathname()
  const { open: openCreateProjectModal } = useCreateProjectModal()
  const { data: projects, isLoading } = useGetProjects({ workspaceId })
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!projects) {
    return <div>No projects found</div>
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase text-neutral-500 font-medium">
          Projects
        </h2>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={openCreateProjectModal}
        />
      </div>
      {projects?.documents.map((project) => {
        const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`
        const isActive = pathname === fullHref
        return (
          <Link key={project.$id} href={fullHref}>
            <div
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-md transition-all duration-300 font-medium hover:opacity-74 text-neutral-500',
                isActive && 'text-primary bg-white shadow-sm hover:opacity-100',
              )}
            >
              <ProjectAvatar name={project.name} image={project.imageUrl} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
