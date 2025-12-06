import { Project } from './types'
import { getMember } from '../members/utils'
import { createSessionClient } from '@/lib/appwrite'
import { DATABASE_ID, PROJECT_ID } from '@/config'

export const getProject = async (projectId: string) => {
  try {
    const { databases, account } = await createSessionClient()
    const user = await account.get()
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECT_ID,
      projectId,
    )
    const member = await getMember({
      databases,
      workspaceId: project?.workspaceId,
      userId: user.$id,
    })
    if (!member) {
      return null
    }
    return project
  } catch {
    return null
  }
}
