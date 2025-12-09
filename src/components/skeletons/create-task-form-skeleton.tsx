import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/ui/dotted-separator'

export function CreateTaskFormSkeleton() {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex px-7">
        <CardTitle className="text-xl font-bold">
          <Skeleton className="h-7 w-48" />
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <div className="flex flex-col gap-y-4">
          {/* Task Name Field */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Due Date Field */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Assignee Field */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Status Field */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <DottedSeparator className="py-7" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

