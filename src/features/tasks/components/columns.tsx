'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreVerticalIcon } from 'lucide-react'
import { Task } from '../types'
import { Button } from '@/components/ui/button'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { TaskDate } from './task-date'
import { Badge } from '@/components/ui/badge'
import { TaskActions } from './task-actions'

export const createColumns = (
  statusesMap: Map<string, string>,
): ColumnDef<Task>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name
      return <p className="truncate line-clamp-1">{name}</p>
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assignee
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            name={assignee?.name || ''}
            className="size-6"
            fallbackClassName="text-xs"
          />
          <p className="truncate line-clamp-1">
            {assignee?.name || 'Unassigned'}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => {
      const dueDate = row.original.dueDate
      return <TaskDate value={dueDate} />
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const statusId = row.original.statusId
      const statusName = statusesMap.get(statusId) || 'Unknown'
      return (
        <Badge variant="secondary" className="capitalize">
          {statusName}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <TaskActions id={row.original.$id} projectId={row.original.projectId}>
          <Button variant="ghost" size="icon" className="size-8 p-0">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskActions>
      )
    },
  },
]
