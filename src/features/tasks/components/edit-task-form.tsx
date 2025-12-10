'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema } from '../schema'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { Task } from '../types'
import { useUpdateTask } from '../api/use-update-task'

interface EditTaskFormProps {
  onCancel?: () => void
  memberOptions: { id: string; name: string }[]
  statusOptions: { id: string; name: string }[]
  initialValues: Task
}
export const EditTaskForm = ({
  onCancel,
  memberOptions,
  statusOptions,
  initialValues,
}: EditTaskFormProps) => {
  const workspaceId = useWorkspaceId()
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      ...initialValues,
      name: initialValues.name,
      description: initialValues.description,
      projectId: initialValues.projectId,
      statusId: initialValues.statusId,
      assigneeId: initialValues.assigneeId,
      workspaceId: initialValues.workspaceId,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  })
  const { mutate: updateTask, isPending } = useUpdateTask()

  console.log('form.formState.errors', form.formState.errors)
  const onSubmit = (data: z.infer<typeof createTaskSchema>) => {
    console.log('data', data)
    const finalValues = {
      ...data,
      workspaceId,
    }
    updateTask(
      { json: finalValues, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          onCancel?.()
        },
      },
    )
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex px-7">
        <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <MemberAvatar
                              name={member.name}
                              className="size-6"
                            />
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value || statusOptions?.[0]?.id}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DottedSeparator className="py-7" />
            </div>
            <div className="flex items-center justify-between">
              <Button
                size="lg"
                type="button"
                variant="secondary"
                onClick={onCancel}
                className={cn(onCancel ? 'block' : 'invisible')}
                disabled={form.formState.isSubmitting || isPending}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                type="submit"
                variant="primary"
                disabled={form.formState.isSubmitting || isPending}
              >
                {isPending ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
