import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useDeleteTask } from '../api/use-delete-task'
import { useConfirm } from '@/hooks/use-confirm'
import { useRouter } from 'next/navigation'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'

interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}
export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { open: openEditTaskModal } = useEditTaskModal()
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask({
    taskId: id,
  })
  const [ConfirmationDialog, confirm] = useConfirm(
    'Delete Task',
    'Are you sure you want to delete this task? This action cannot be undone.',
    'destructive',
  )

  const handleDeleteTask = async () => {
    const ok = await confirm()
    if (!ok) return
    deleteTask({ param: { taskId: id } })
  }

  const handleEditTask = () => {
    openEditTaskModal(id)
  }
  const handleOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }
  return (
    <div className="flex justify-end">
      <ConfirmationDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleOpenTask}
            className="font-medium p-3"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEditTask}
            className="font-medium p-3"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            disabled={isDeletingTask}
            className="font-medium p-3 text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
