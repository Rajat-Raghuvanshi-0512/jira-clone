import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { Separator } from '@/components/ui/separator'

interface MembersListSkeletonProps {
  memberCount?: number
}

export function MembersListSkeleton({ memberCount = 4 }: MembersListSkeletonProps) {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <div className="flex flex-col gap-4">
          {Array.from({ length: memberCount }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="size-9 rounded-md ml-auto" />
              </div>
              {index < memberCount - 1 && (
                <Separator className="my-2.5 bg-neutral-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

