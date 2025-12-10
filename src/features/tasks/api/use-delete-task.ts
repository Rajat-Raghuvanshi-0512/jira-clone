import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/rpc'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { InferRequestType } from 'hono'

interface UseDeleteTaskProps {
  taskId: string
}

type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$delete']
>

export const useDeleteTask = ({ taskId }: UseDeleteTaskProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: async ({ param }: RequestType) => {
      const response = await client.api.tasks[':taskId']['$delete']({
        param,
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      const { data } = await response.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      router.refresh()
      toast.success('Task deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete task')
    },
  })
}
