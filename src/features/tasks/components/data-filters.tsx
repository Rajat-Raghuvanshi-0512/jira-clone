import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useGetStatuses } from '@/features/projects/api/use-get-statuses'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { ListCheckIcon, UserIcon } from 'lucide-react'
import { useProjectId } from '@/features/projects/hooks/use-project-id'
import { useTaskFilters } from '../hooks/use-task-filters'

interface DataFiltersProps {
  hideProjectFilter?: boolean
}
export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  })
  const [{ statusId, search, dueDate, assigneeId }, setFilters] =
    useTaskFilters()
  const { data: statuses, isLoading: isLoadingStatuses } = useGetStatuses({
    projectId,
  })

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingStatuses

  const projectOptions =
    projects?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
    })) ?? []
  const memberOptions =
    members?.documents.map((member) => ({
      id: member.$id,
      name: member.name,
    })) ?? []

  const onStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ statusId: null })
    } else {
      setFilters({ statusId: value })
    }
  }

  const onDueDateChange = (value?: string) => {
    if (!value) {
      setFilters({ dueDate: null })
    } else {
      setFilters({ dueDate: value })
    }
  }
  const onAssigneeChange = (value: string) => {
    if (value === 'all') {
      setFilters({ assigneeId: null })
    } else {
      setFilters({ assigneeId: value })
    }
  }

  const statusOptions =
    statuses?.documents.map((status) => ({
      id: status.$id,
      name: status.name,
    })) ?? []

  console.log('statusOptions', statusOptions)
  if (isLoading) {
    return null
  }

  return (
    <div className="flex flex-col lg:flex-row gap-x-2">
      <Select
        value={statusId || 'all'}
        onValueChange={(value) => {
          onStatusChange(value)
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          {statusOptions.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {status.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={assigneeId || 'all'}
        onValueChange={(value) => {
          onAssigneeChange(value)
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(value) => {
          onDueDateChange(value?.toISOString())
        }}
        className="w-full lg:w-auto"
      />
    </div>
  )
}
