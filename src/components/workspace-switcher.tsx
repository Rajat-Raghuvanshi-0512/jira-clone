'use client'

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { RiAddCircleFill } from 'react-icons/ri'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar'
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal'
import { WorkspaceSwitcherSkeleton } from './skeletons'

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces()
  const { open } = useCreateWorkspaceModal()
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`)
  }
  if (isLoading) {
    return <WorkspaceSwitcherSkeleton />
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase text-neutral-500 font-medium">
          Workspaces
        </h2>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={open}
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center gap-3 justify-start font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.image}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
