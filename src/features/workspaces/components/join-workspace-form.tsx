'use client'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { useJoinWorkspace } from '../api/use-join-workspace'
import { useRouter } from 'next/navigation'

interface JoinWorkspaceFormProps {
  inviteCode: string
  workspaceId: string
  initialValues: {
    name: string
  }
}

export const JoinWorkspaceForm = ({
  inviteCode,
  workspaceId,
  initialValues,
}: JoinWorkspaceFormProps) => {
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace()
  const router = useRouter()
  const onSubmit = () => {
    joinWorkspace(
      {
        param: {
          workspaceId: workspaceId,
        },
        json: {
          inviteCode,
        },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`)
        },
      },
    )
  }
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="px-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join the workspace{' '}
          <span className="font-bold">{initialValues.name}</span>.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            asChild
            size="lg"
            type="button"
            variant="secondary"
            disabled={isPending}
            className="w-full lg:w-fit"
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            type="button"
            variant="primary"
            onClick={onSubmit}
            disabled={isPending}
            className="w-full lg:w-fit"
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
