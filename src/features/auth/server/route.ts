import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signInSchema, signUpSchema } from '../schema'
import { createAdminClient } from '@/lib/appwrite'
import { ID } from 'node-appwrite'
import { deleteCookie, setCookie } from 'hono/cookie'
import { AUTH_COOKIE_NAME } from '../constants'
import { sessionMiddleware } from '@/lib/session-middleware'

const app = new Hono()
  .get('/me', sessionMiddleware, (c) => {
    const user = c.get('user')
    return c.json({ data: user })
  })
  .post('/login', zValidator('json', signInSchema), async (c) => {
    const { email, password } = c.req.valid('json')
    try {
      const { account } = await createAdminClient()
      const session = await account.createEmailPasswordSession({
        email,
        password,
      })
      if (!session) {
        return c.json({ error: 'Failed to create session' }, 500)
      }
      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
      return c.json({ success: true })
    } catch (error) {
      console.error(error)
      return c.json({ error: 'Failed to login' }, 500)
    }
  })
  .post('/register', zValidator('json', signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid('json')
    const { account } = await createAdminClient()
    const user = await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    })
    if (!user) {
      return c.json({ error: 'Failed to create user' }, 500)
    }
    const session = await account.createEmailPasswordSession({
      email,
      password,
    })
    if (!session) {
      return c.json({ error: 'Failed to create session' }, 500)
    }
    setCookie(c, AUTH_COOKIE_NAME, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    return c.json({ success: true, user })
  })
  .post('/logout', sessionMiddleware, async (c) => {
    const account = c.get('account')
    deleteCookie(c, AUTH_COOKIE_NAME)
    await account.deleteSession({ sessionId: 'current' })
    return c.json({ success: true })
  })

export default app
