import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/rpc'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[':taskId']['$patch'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.tasks)[':taskId']['$patch']
>

export const useUpdateTask = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.tasks[':taskId']['$patch']({
        param,
        json,
      })
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      return await response.json()
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', data.$id] })
      router.refresh()
      toast.success('Task updated successfully')
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })
}
