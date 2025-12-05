'use server'

import { Query } from 'node-appwrite'
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from '@/config'
import { getMember } from '../members/utils'
import { Workspace } from './types'
import { createSessionClient } from '@/lib/appwrite'

export const getWorkspaces = async () => {
  try {
    const { databases, account } = await createSessionClient()
    const user = await account.get()
    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: MEMBER_ID,
      queries: [Query.equal('userId', user.$id)],
    })

    if (members.total === 0) {
      return { documents: [], total: 0 }
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId)
    const workspaces = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: WORKSPACE_ID,
      queries: [Query.contains('$id', workspaceIds), Query.orderAsc('name')],
    })
    return workspaces
  } catch {
    return { documents: [], total: 0 }
  }
}

export const getWorkspace = async (workspaceId: string) => {
  try {
    const { databases, account } = await createSessionClient()
    const user = await account.get()
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })
    if (!member) {
      return null
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId,
    )
    return workspace
  } catch {
    return null
  }
}
