import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.auth)['logout']['$post']
>;
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, void>({
    mutationFn: async () => {
      const response = await client.api.auth['logout']['$post']();
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
  });
};
