import 'server-only';
import { Account, Client, Databases, Storage, Users } from 'node-appwrite';

export async function createAdminClient() {
  const client = new Client();
  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!);
  client.setKey(process.env.APPWRITE_API_KEY!);
  return {
    get account() {
      return new Account(client);
    },
  };
}
