import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/rpc'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.projects)[':projectId']['$patch'],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.projects)[':projectId']['$patch']
>

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, form }) => {
      const response = await client.api.projects[':projectId']['$patch']({
        param,
        form,
      })
      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      return await response.json()
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', data.$id] })
      toast.success(`Project updated`)
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })
}
