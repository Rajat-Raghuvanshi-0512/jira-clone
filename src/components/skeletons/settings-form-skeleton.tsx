import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DottedSeparator } from '@/components/ui/dotted-separator'

interface SettingsFormSkeletonProps {
  title?: string
}

export function SettingsFormSkeleton({ title = 'Edit' }: SettingsFormSkeletonProps) {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-7 w-32" />
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="px-7">
        <div className="flex flex-col gap-y-4">
          {/* Name Field */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-5">
              <Skeleton className="size-20 rounded-md" />
              <div className="flex flex-col gap-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-8 w-24 rounded-md mt-2" />
              </div>
            </div>
          </div>

          <DottedSeparator className="py-7" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

