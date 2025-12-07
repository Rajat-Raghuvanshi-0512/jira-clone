import { Skeleton } from '@/components/ui/skeleton'

export function WorkspaceSwitcherSkeleton() {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}

