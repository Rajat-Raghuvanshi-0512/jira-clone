import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import authRoutes from '@/features/auth/server/route'
import workspacesRoutes from '@/features/workspaces/server/route'
import membersRoutes from '@/features/members/server/route'

const app = new Hono().basePath('/api')

const routes = app
  .route('/auth', authRoutes)
  .route('/workspaces', workspacesRoutes)
  .route('/members', membersRoutes)

export const GET = handle(routes)
export const POST = handle(routes)
export const PUT = handle(routes)
export const DELETE = handle(routes)
export const PATCH = handle(routes)

export type AppType = typeof routes
