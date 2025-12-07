import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { DottedSeparator } from '@/components/ui/dotted-separator'

export function InviteMembersSkeleton() {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="px-7 py-7">
        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-x-2 mt-4">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="size-12 rounded-md" />
          </div>
          <DottedSeparator className="py-7" />
          <div className="flex justify-end">
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

