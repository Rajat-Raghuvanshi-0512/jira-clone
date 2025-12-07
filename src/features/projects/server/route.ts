import z from 'zod'
import { Hono } from 'hono'
import { ID } from 'node-appwrite'
import { Query } from 'node-appwrite'
import { createProjectSchema, updateProjectSchema } from '../schema'
import { zValidator } from '@hono/zod-validator'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/session-middleware'
import { DATABASE_ID, IMAGE_BUCKET_ID, PROJECT_ID, STATUS_ID } from '@/config'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({ workspaceId: z.string() })),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const { workspaceId } = c.req.valid('query')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const projects = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: PROJECT_ID,
        queries: [
          Query.orderDesc('$createdAt'),
          Query.equal('workspaceId', workspaceId),
        ],
      })
      return c.json({ data: projects })
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('form', createProjectSchema),
    async (c) => {
      const user = c.get('user')
      const storage = c.get('storage')
      const databases = c.get('databases')
      const { name, image, workspaceId } = c.req.valid('form')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      let uploadedImageUrl: string | undefined
      if (image && image instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          image,
        )
        const fileBuffer = await storage.getFileDownload(
          IMAGE_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          fileBuffer,
        ).toString('base64')}`
      } else {
        uploadedImageUrl = image
      }

      const project = await databases.createDocument({
        collectionId: PROJECT_ID,
        databaseId: DATABASE_ID,
        documentId: ID.unique(),
        data: {
          name,
          workspaceId,
          imageUrl: uploadedImageUrl,
        },
      })
      await databases.createDocuments({
        collectionId: STATUS_ID,
        databaseId: DATABASE_ID,
        documents: [
          {
            documentId: ID.unique(),
            data: {
              name: 'To Do',
              projectId: project.$id,
            },
          },
          {
            documentId: ID.unique(),
            data: {
              name: 'In Progress',
              projectId: project.$id,
            },
          },
          {
            documentId: ID.unique(),
            data: {
              name: 'Done',
              projectId: project.$id,
            },
          },
        ],
      })

      return c.json({ data: project })
    },
  )
  .patch(
    '/:projectId',
    sessionMiddleware,
    zValidator('form', updateProjectSchema),
    async (c) => {
      const databases = c.get('databases')
      const user = c.get('user')
      const storage = c.get('storage')

      const { projectId } = c.req.param()
      const { name, image } = c.req.valid('form')

      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECT_ID,
        projectId,
      )
      if (!project) {
        return c.json({ error: 'Project not found' }, 404)
      }
      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      let uploadedImageUrl: string | undefined
      if (image && image instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          image,
        )
        const fileBuffer = await storage.getFileDownload(
          IMAGE_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          fileBuffer,
        ).toString('base64')}`
      } else {
        uploadedImageUrl = image
      }
      const updatedProject = await databases.updateDocument(
        DATABASE_ID,
        PROJECT_ID,
        projectId,
        {
          name,
          image: uploadedImageUrl,
        },
      )
      return c.json({ data: updatedProject })
    },
  )
export default app
