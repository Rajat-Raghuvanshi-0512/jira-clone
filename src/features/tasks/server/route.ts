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
import { Task } from '../types'

const app = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator(
      'query',
      z.object({
        workspaceId: z.string(),
        statusId: z.string().optional(),
        projectId: z.string().optional(),
        search: z.string().optional(),
        dueDate: z.string().optional(),
        assigneeId: z.string().optional(),
      }),
    ),
    async (c) => {
      const databases = c.get('databases')
      const { users } = await createAdminClient()
      const user = c.get('user')
      const { projectId, workspaceId, statusId, search, dueDate, assigneeId } =
        c.req.valid('query')
      console.log({
        projectId,
        workspaceId,
        statusId,
        search,
        dueDate,
        assigneeId,
      })
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
      if (dueDate) queries.push(Query.equal('dueDate', dueDate))
      if (assigneeId) queries.push(Query.equal('assigneeId', assigneeId))

      console.log('queries', queries)
      const tasks = await databases.listDocuments<Task>({
        collectionId: TASK_ID,
        databaseId: DATABASE_ID,
        queries,
      })
      const projectIds = [
        ...new Set(
          tasks.documents
            .map((task) => task.projectId)
            .filter((id) => Boolean(id)),
        ),
      ]
      const assigneeIds = [
        ...new Set(
          tasks.documents
            .map((task) => task.assigneeId)
            .filter((id) => Boolean(id)),
        ),
      ]

      // Fetch projects by workspace and filter by projectIds
      const projects = await databases.listDocuments<Project>({
        collectionId: PROJECT_ID,
        databaseId: DATABASE_ID,
        queries: [Query.equal('workspaceId', workspaceId)],
      })

      // Fetch members by workspace and filter by assigneeIds
      const members = await databases.listDocuments({
        collectionId: MEMBER_ID,
        databaseId: DATABASE_ID,
        queries: [Query.equal('workspaceId', workspaceId)],
      })

      // Filter projects and members to only include those referenced by tasks
      const filteredProjects = projects.documents.filter((project) =>
        projectIds.includes(project.$id),
      )
      const filteredMembers = members.documents.filter((member) =>
        assigneeIds.includes(member.$id),
      )

      const assignees = await Promise.all(
        filteredMembers.map(async (member) => {
          const user = await users.get(member.userId)
          return {
            ...member,
            name: user?.name,
            email: user?.email,
          }
        }),
      )

      const populatedTasks = tasks.documents.map((task) => {
        const project = filteredProjects.find(
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
