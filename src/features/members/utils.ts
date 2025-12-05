import { Query, type Databases } from 'node-appwrite'
import { MEMBER_ID, DATABASE_ID } from '@/config'

interface GetMemberProps {
  databases: Databases
  workspaceId: string
  userId: string
}
export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  const member = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: MEMBER_ID,
    queries: [
      Query.equal('workspaceId', workspaceId),
      Query.equal('userId', userId),
    ],
  })

  return member.documents[0]
}
