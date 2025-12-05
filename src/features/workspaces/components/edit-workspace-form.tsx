'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateWorkspaceSchema } from '../schema'
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
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUpdateWorkspace } from '../api/use-update-workspace'
import { Workspace } from '../types'
import { useConfirm } from '@/hooks/use-confirm'
import { useDeleteWorkspace } from '../api/use-delete-workspace'
import { toast } from 'sonner'
import { useResetInviteCode } from '../api/use-reset-invite-code'

interface EditWorkspaceFormProps {
  onCancel?: () => void
  workspaceId: string
  initialValues: Workspace
}
export const EditWorkspaceForm = ({
  onCancel,
  workspaceId,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialValues.name,
      image: initialValues.image ?? '',
    },
  })
  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'Are you sure you want to delete this workspace? This action cannot be undone.',
    'destructive',
  )
  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    'Reset Invite Code',
    'Are you sure you want to reset the invite code? This will generate a new invite code.',
    'destructive',
  )
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace()
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode()
  const onSubmit = (data: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : '',
    }
    updateWorkspace(
      { form: finalValues, param: { workspaceId } },
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
    deleteWorkspace(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          router.push('/')
        },
      },
    )
  }

  const fullInviteCode = `${window.location.origin}/workspaces/${workspaceId}/join/${initialValues.inviteCode}`

  const handleResetInviteCode = async () => {
    const ok = await confirmResetInviteCode()
    if (!ok) {
      return
    }
    resetInviteCode(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${workspaceId}`)
            }
          >
            <ArrowLeftIcon className="size-4" /> Back
          </Button>
          <CardTitle className="text-xl font-bold">Edit Workspace</CardTitle>
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
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
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
                              alt="Workspace Image"
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
                          <p className="text-sm font-medium">Workspace Icon</p>
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
            <h3 className="text-lg font-bold">Invite members</h3>
            <p className="text-sm text-muted-foreground">
              Use this link to invite members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteCode} />
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="size-12"
                  onClick={() => {
                    navigator.clipboard.writeText(fullInviteCode)
                    toast.success('Invite link copied to clipboard')
                  }}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              size="sm"
              type="button"
              variant="destructive"
              onClick={() => handleResetInviteCode()}
              className="w-fit ml-auto"
              disabled={isPending || isResettingInviteCode}
            >
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Delete this workspace and all its data.
            </p>
            <Button
              size="sm"
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="mt-2 w-fit ml-auto"
              disabled={isPending || isDeleting}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
