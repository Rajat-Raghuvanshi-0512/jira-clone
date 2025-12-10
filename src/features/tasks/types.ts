import { Models } from 'node-appwrite'
import { MemberRole } from '@/features/members/types'

export type TaskAssignee = Models.Document & {
  userId?: string
  workspaceId?: string
  role?: MemberRole
  name?: string
  email?: string
}

export type Task = Models.Document & {
  name: string
  description: string
  projectId: string
  workspaceId: string
  statusId: string
  dueDate: string
  assigneeId?: string
  position: number
  assignee?: TaskAssignee
}
