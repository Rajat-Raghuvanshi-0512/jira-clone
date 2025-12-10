'use client'
import { CreateTaskForm } from './create-task-form'
import { CreateTaskFormSkeleton } from '@/components/skeletons'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useGetStatuses } from '@/features/projects/api/use-get-statuses'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { useGetTask } from '../api/use-get-task'
import { EditTaskForm } from './edit-task-form'

interface EditTaskFormWrapperProps {
  taskId: string
  onCancel: () => void
}
export const EditTaskFormWrapper = ({
  taskId,
  onCancel,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()

  const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })
  const { data: statuses, isLoading: isLoadingStatuses } =
    useGetStatuses({
      projectId,
    }) ?? []

  const statusOptions =
    statuses?.documents.map((status) => ({
      id: status.$id,
      name: status.name,
    })) ?? []

  const memberOptions =
    members?.documents.map((member) => ({
      id: member.$id,
      name: member.name,
    })) ?? []

  if (isLoadingMembers || isLoadingStatuses || isLoadingTask) {
    return <CreateTaskFormSkeleton />
  }

  if (!task) {
    return null
  }

  return (
    <EditTaskForm
      initialValues={task}
      memberOptions={memberOptions}
      statusOptions={statusOptions}
      onCancel={onCancel}
    />
  )
}
