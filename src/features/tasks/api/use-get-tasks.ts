import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/rpc'

interface UseGetTasksProps {
  workspaceId: string
  statusId?: string
  projectId?: string
  search?: string
  dueDate?: Date
  assigneeId?: string
}

export const useGetTasks = ({
  workspaceId,
  statusId,
  projectId,
  search,
  dueDate,
  assigneeId,
}: UseGetTasksProps) => {
  return useQuery({
    queryKey: [
      'tasks',
      workspaceId,
      statusId,
      projectId,
      search,
      dueDate,
      assigneeId,
    ],
    queryFn: async () => {
      // Build query object with only defined values to prevent undefined/null strings
      const query: {
        workspaceId: string
        statusId?: string
        projectId?: string
        search?: string
        dueDate?: string
        assigneeId?: string
      } = { workspaceId }

      if (statusId) query.statusId = statusId
      if (projectId) query.projectId = projectId
      if (search) query.search = search
      if (dueDate) query.dueDate = dueDate.toISOString()
      if (assigneeId) query.assigneeId = assigneeId

      const response = await client.api.tasks['$get']({
        query,
      })
      if (!response.ok) {
        throw new Error('Failed to get tasks')
      }
      const { data } = await response.json()
      return data
    },
  })
}
