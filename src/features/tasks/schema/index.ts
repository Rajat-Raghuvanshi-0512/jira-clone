import { z } from 'zod'

export const createTaskSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable().optional(),
  projectId: z.string().min(1, { message: 'Project ID is required' }),
  workspaceId: z.string().min(1, { message: 'Workspace ID is required' }),
  statusId: z.string().min(1, { message: 'Status ID is required' }),
  dueDate: z.coerce.date<Date>().optional(),
  assigneeId: z.string().nullable().optional(),
})
