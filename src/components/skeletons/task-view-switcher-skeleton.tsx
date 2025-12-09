import { Skeleton } from '../ui/skeleton'

export function TaskViewSwitcherSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
