import 'server-only'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { AUTH_COOKIE_NAME } from '@/features/auth/constants'
import { Account, Client, Databases, Models, Storage } from 'node-appwrite'
import type {
  Account as AccountType,
  Databases as DatabasesType,
  Storage as StorageType,
  Users as UsersType,
} from 'node-appwrite'

type SessionMiddlewareContext = {
  Variables: {
    users: UsersType
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    user: Models.User<Models.Preferences>
  }
}
export const sessionMiddleware = createMiddleware<SessionMiddlewareContext>(
  async (c, next) => {
    const cookie = getCookie(c, AUTH_COOKIE_NAME)
    if (!cookie) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    try {
      const client = new Client()
      client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!)
      const session = getCookie(c, AUTH_COOKIE_NAME)
      if (!session) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      client.setSession(session)
      const account = new Account(client)
      const databases = new Databases(client)
      const storage = new Storage(client)
      const user = await account.get()
      c.set('user', user)
      c.set('account', account)
      c.set('databases', databases)
      c.set('storage', storage)
      return next()
    } catch {
      return c.json({ error: 'Unauthorized' }, 401)
    }
  },
)
