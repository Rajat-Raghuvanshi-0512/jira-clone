import 'server-only'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME } from '@/features/auth/constants'
import { Account, Client, Databases } from 'node-appwrite'

export async function createSessionClient() {
  const client = new Client()
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!)

  const cookieStore = await cookies()
  const session = cookieStore.get(AUTH_COOKIE_NAME)
  if (!session || !session.value) {
    throw new Error('Unauthorized')
  }
  client.setSession(session.value)
  return {
    get account() {
      return new Account(client)
    },
    get databases() {
      return new Databases(client)
    },
  }
}

export async function createAdminClient() {
  const client = new Client()
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!)
  client.setKey(process.env.APPWRITE_API_KEY!)
  return {
    get account() {
      return new Account(client)
    },
  }
}
