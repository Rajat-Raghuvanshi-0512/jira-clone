"use server";

import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const client = new Client();
    client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
    client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_KEY!);
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);
    if (!session) {
      return { documents: [], total: 0 };
    }
    client.setSession(session.value);
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();
    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: MEMBER_ID,
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: WORKSPACE_ID,
      queries: [Query.contains("$id", workspaceIds), Query.orderAsc("name")],
    });
    return workspaces;
  } catch (error) {
    console.error(error);
    return { documents: [], total: 0 };
  }
};

export const getWorkspace = async (workspaceId: string) => {
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
    const user = await account.get();
    const databases = new Databases(client);
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return null;
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );
    return workspace;
  } catch (error) {
    console.error(error);
    return null;
  }
};
