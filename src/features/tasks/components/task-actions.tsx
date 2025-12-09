import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react'

interface TaskActionsProps {
  id: string
  projectId: string
  children: React.ReactNode
}
export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-48">
          <DropdownMenuItem className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-3">
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-3 text-amber-700 focus:text-amber-700">
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
