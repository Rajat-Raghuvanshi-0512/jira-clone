'use client'

import { DataTable } from './data-table'

import { useQueryState } from 'nuqs'
import { DataFilters } from './data-filters'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { useGetTasks } from '../api/use-get-tasks'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { TaskViewSwitcherSkeleton } from '@/components/skeletons'
import { useTaskFilters } from '../hooks/use-task-filters'
import { useProjectId } from '@/features/projects/hooks/use-project-id'

export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal()
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()
  const [{ statusId, search, dueDate, assigneeId }] = useTaskFilters()

  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  })

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    statusId: statusId || undefined,
    projectId: projectId || undefined,
    search: search || undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    assigneeId: assigneeId || undefined,
  })
  return (
    <Tabs
      className="w-full flex-1 rounded-lg"
      defaultValue={view}
      onValueChange={(value) => setView(value)}
    >
      <div className="flex flex-col overflow-auto h-full p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="w-full lg:w-auto h-8" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto h-8" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="w-full lg:w-auto h-8" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            variant="secondary"
            size="sm"
            className="w-full lg:w-auto"
            onClick={open}
          >
            <PlusIcon className="size-4 mr-2" />
            Add Task
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <TaskViewSwitcherSkeleton />
        ) : (
          <>
            <TabsContent value="table">
              <DataTable data={tasks ? tasks?.documents : []} />
            </TabsContent>
            <TabsContent value="kanban">
              <div>Kanban</div>
            </TabsContent>
            <TabsContent value="calendar">
              <div>Calendar</div>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  )
}
