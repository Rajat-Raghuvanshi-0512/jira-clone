import { Hono } from 'hono'
import { ID, Query } from 'node-appwrite'
import { createTaskSchema } from '../schema'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { getMember } from '@/features/members/utils'
import { sessionMiddleware } from '@/lib/session-middleware'
import { createAdminClient } from '@/lib/appwrite'
import { Project } from '@/features/projects/types'
import { TASK_ID, DATABASE_ID, PROJECT_ID, MEMBER_ID } from '@/config'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        statusId: z.string(),
        projectId: z.string().optional(),
        search: z.string().optional(),
        dueDate: z.date().optional(),
        assigneeId: z.string().optional(),
      }),
    ),
    async (c) => {
      const databases = c.get('databases')
      const { users } = await createAdminClient()
      const user = c.get('user')
      const { projectId, workspaceId, statusId, search, dueDate, assigneeId } =
        c.req.valid('query')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const queries = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ]
      if (projectId) {
        queries.push(Query.equal('projectId', projectId))
      }
      if (statusId) {
        queries.push(Query.equal('statusId', statusId))
      }
      if (search) queries.push(Query.search('name', search))
      if (dueDate) queries.push(Query.equal('dueDate', dueDate.toISOString()))
      if (assigneeId) queries.push(Query.equal('assigneeId', assigneeId))
      const tasks = await databases.listDocuments({
        collectionId: TASK_ID,
        databaseId: DATABASE_ID,
        queries,
      })
      const projectIds = tasks.documents.map((task) => task.projectId)
      const assigneeIds = tasks.documents.map((task) => task.assigneeId)

      const projects = await databases.listDocuments<Project>({
        collectionId: PROJECT_ID,
        databaseId: DATABASE_ID,
        queries:
          projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
      })
      const members = await databases.listDocuments({
        collectionId: MEMBER_ID,
        databaseId: DATABASE_ID,
        queries:
          assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
      })

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)
          return {
            ...member,
            name: user?.name,
            email: user?.email,
          }
        }),
      )
      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId,
        )
        const assignee = assignees.find(
          (member) => member.$id === task.assigneeId,
        )
        return {
          ...task,
          project: project,
          assignee: assignee,
        }
      })
      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      })
    },
  )
  .post(
    '/',
    sessionMiddleware,
    zValidator('json', createTaskSchema),
    async (c) => {
      const user = c.get('user')
      const databases = c.get('databases')
      const {
        name,
        description,
        projectId,
        workspaceId,
        statusId,
        dueDate,
        assigneeId,
      } = c.req.valid('json')

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })
      if (!member) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const highestPositionTask = await databases.listDocuments({
        collectionId: TASK_ID,
        databaseId: DATABASE_ID,
        queries: [
          Query.limit(1),
          Query.orderAsc('position'),
          Query.equal('statusId', statusId),
          Query.equal('workspaceId', workspaceId),
        ],
      })

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000

      const task = await databases.createDocument({
        collectionId: TASK_ID,
        databaseId: DATABASE_ID,
        documentId: ID.unique(),
        data: {
          name,
          description,
          projectId,
          workspaceId,
          statusId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      })
      return c.json({ data: task })
    },
  )

export default app
