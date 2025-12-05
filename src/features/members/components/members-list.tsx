'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { MemberAvatar } from './member-avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGetMembers } from '../api/use-get-members'
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteMember } from '../api/use-delete-member'
import { useUpdateMember } from '../api/use-update-member'
import { MemberRole } from '../types'
import { useConfirm } from '@/hooks/use-confirm'

export const MembersList = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember()
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()
  const { data: members } = useGetMembers({ workspaceId })
  const [ConfirmationDialog, confirm] = useConfirm(
    'Remove from workspace',
    'Are you sure you want to remove this member from the workspace?',
    'destructive',
  )

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm()
    if (!ok) return
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          router.refresh()
        },
      },
    )
  }
  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } })
  }
  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmationDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size="sm" variant="secondary" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <div className="flex flex-col gap-4">
          {members?.documents.map((member, index) => (
            <Fragment key={member.$id}>
              <div key={member.$id} className="flex items-center gap-x-2">
                <MemberAvatar
                  name={member.name}
                  className="size-10"
                  fallbackClassName="text-lg"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="ml-auto">
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.ADMIN)
                      }
                      disabled={isUpdatingMember}
                    >
                      Set as admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() =>
                        handleUpdateMember(member.$id, MemberRole.MEMBER)
                      }
                      disabled={isUpdatingMember}
                    >
                      Set as member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-amber-700"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={isDeletingMember}
                    >
                      Remove from workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < members?.documents.length - 1 && (
                <Separator className="my-2.5 bg-neutral-500" />
              )}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
