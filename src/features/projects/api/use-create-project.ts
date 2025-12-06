import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/rpc'
import { toast } from 'sonner'

type ResponseType = InferResponseType<
  (typeof client.api.projects)['$post'],
  200
>
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects['$post']({
        form,
      })
      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })
}
