'use server';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';
import { AUTH_COOKIE_NAME } from './constants';

export const getCurrentUser = async () => {
  try {
    const client = new Client();
    client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
    client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!);
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);
    if (!session) {
      return null;
    }
    client.setSession(session.value);
    const account = new Account(client);
    return await account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
};
