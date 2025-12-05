import { DATABASE_ID, MEMBER_ID } from '@/config'
import { sessionMiddleware } from '@/lib/session-middleware'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import z from 'zod'
import { Query } from 'node-appwrite'
import { createAdminClient } from '@/lib/appwrite'
import { getMember } from '../utils'
import { MemberRole } from '../types'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.valid('query')
      const { users } = await createAdminClient()

      const member = getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const members = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: MEMBER_ID,
        queries: [Query.equal('workspaceId', workspaceId)],
      })

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)
          return {
            ...member,
            name: user?.name,
            email: user?.email,
          }
        }),
      )
      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      })
    },
  )
  .delete('/:memberId', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const { memberId } = c.req.param()

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBER_ID,
      memberId,
    )
    const allMembers = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: MEMBER_ID,
      queries: [Query.equal('workspaceId', memberToDelete.workspaceId)],
    })
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    })
    if (!member) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (allMembers.documents.length === 1) {
      return c.json(
        { error: 'Cannot delete the last member of the workspace' },
        400,
      )
    }
    await databases.deleteDocument(DATABASE_ID, MEMBER_ID, memberId)
    return c.json({ data: { $id: memberId } })
  })
  .patch(
    '/:memberId',
    sessionMiddleware,
    zValidator('json', z.object({ role: z.enum(MemberRole) })),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { memberId } = c.req.param()
      const { role } = c.req.valid('json')
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBER_ID,
        memberId,
      )
      if (!memberToUpdate) {
        return c.json({ error: 'Member not found' }, 404)
      }
      const allMembers = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: MEMBER_ID,
        queries: [Query.equal('workspaceId', memberToUpdate.workspaceId)],
      })
      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      if (allMembers.documents.length === 1) {
        return c.json(
          {
            error: 'Cannot update the role of the last member of the workspace',
          },
          400,
        )
      }
      await databases.updateDocument(DATABASE_ID, MEMBER_ID, memberId, { role })
      return c.json({ data: { $id: memberToUpdate.$id } })
    },
  )
export default app
