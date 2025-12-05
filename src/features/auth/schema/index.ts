import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email().trim().min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must be at most 20 characters' }),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.email().trim().min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8)
    .max(20, { message: 'Password must be at most 20 characters' }),
})
