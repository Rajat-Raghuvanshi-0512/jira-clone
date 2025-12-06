'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProjectSchema } from '../schema'
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
import { useRef } from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { ArrowLeftIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUpdateProject } from '../api/use-update-project'
import { Project } from '../types'
import { useConfirm } from '@/hooks/use-confirm'

interface EditProjectFormProps {
  onCancel?: () => void
  projectId: string
  initialValues: Project
  workspaceId: string
}
export const EditProjectForm = ({
  onCancel,
  projectId,
  initialValues,
  workspaceId,
}: EditProjectFormProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.imageUrl ?? '',
    },
  })
  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Project',
    'Are you sure you want to delete this project? This action cannot be undone.',
    'destructive',
  )
  const { mutate: updateProject, isPending } = useUpdateProject()
  // const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteProject()
  const onSubmit = (data: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : '',
    }
    updateProject(
      { form: finalValues, param: { projectId } },
      {
        onSuccess: ({ data }) => {
          form.reset()
          router.push(`/workspaces/${data.$id}`)
        },
      },
    )
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
    }
  }
  const handleDelete = async () => {
    const ok = await confirmDelete()
    if (!ok) {
      return
    }
    // deleteWorkspace(
    //   { param: { projectId } },
    //   {
    //     onSuccess: () => {
    //       router.push('/')
    //     },
    //   },
    // )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${workspaceId}/projects/${projectId}`,
                    )
            }
          >
            <ArrowLeftIcon className="size-4" /> Back
          </Button>
          <CardTitle className="text-xl font-bold">Edit Project</CardTitle>
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-20 relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Project Image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-20 bg-neutral-100 flex items-center justify-center">
                            <AvatarFallback>
                              <ImageIcon className="size-9 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col ">
                          <p className="text-sm font-medium">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            Either jpeg, png or svg, max size 5MB
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg, .jpeg, .png, .svg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                form.setValue('image', '')
                                if (inputRef.current) {
                                  inputRef.current.value = ''
                                }
                              }}
                              disabled={isPending}
                            >
                              Remove image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="tertiary"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                              disabled={isPending}
                            >
                              Upload image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Delete this project and all its data.
            </p>
            <Button
              size="sm"
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="mt-2 w-fit ml-auto"
              disabled={isPending}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
