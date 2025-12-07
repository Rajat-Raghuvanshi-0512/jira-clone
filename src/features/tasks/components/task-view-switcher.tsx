'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'

export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal()
  return (
    <Tabs className="w-full flex-1 rounded-lg" defaultValue="table">
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
        Filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table">
            <div>Table</div>
          </TabsContent>
          <TabsContent value="kanban">
            <div>Kanban</div>
          </TabsContent>
          <TabsContent value="calendar">
            <div>Calendar</div>
          </TabsContent>
        </>
      </div>
    </Tabs>
  )
}
