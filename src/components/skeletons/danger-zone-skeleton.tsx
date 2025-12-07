import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function DangerZoneSkeleton() {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardContent className="px-7 py-7">
        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-56" />
          <div className="flex justify-end mt-2">
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

