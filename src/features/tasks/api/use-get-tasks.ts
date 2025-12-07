import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/rpc'

interface UseGetTasksProps {
  workspaceId: string
  statusId: string
  projectId: string
  search: string
  dueDate: Date
  assigneeId: string
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
    queryKey: ['tasks', workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks['$get']({
        query: {
          workspaceId,
          statusId,
          projectId,
          search,
          dueDate: dueDate?.toISOString(),
          assigneeId,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to get tasks')
      }
      const { data } = await response.json()
      return data
    },
  })
}
