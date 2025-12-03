import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === '' ? undefined : val)),
    ])
    .optional(),
});
