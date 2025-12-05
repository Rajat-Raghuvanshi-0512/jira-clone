import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import authRoutes from '@/features/auth/server/route'
import workspacesRoutes from '@/features/workspaces/server/route'

const app = new Hono().basePath('/api')

const routes = app
  .route('/auth', authRoutes)
  .route('/workspaces', workspacesRoutes)

export const GET = handle(routes)
export const POST = handle(routes)
export const PUT = handle(routes)
export const DELETE = handle(routes)
export const PATCH = handle(routes)
export const OPTIONS = handle(routes)
export const HEAD = handle(routes)

export type AppType = typeof routes
