import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/rpc'

interface UseGetStatusesProps {
  projectId: string
}
export const useGetStatuses = ({ projectId }: UseGetStatusesProps) => {
  return useQuery({
    queryKey: ['statuses', projectId],
    queryFn: async () => {
      const response = await client.api.projects[':projectId'].statuses['$get'](
        {
          param: {
            projectId,
          },
        },
      )
      if (!response.ok) {
        throw new Error('Failed to get statuses')
      }
      const { data } = await response.json()
      return data
    },
  })
}
