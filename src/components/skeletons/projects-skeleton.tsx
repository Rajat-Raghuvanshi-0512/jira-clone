import { Skeleton } from '@/components/ui/skeleton'

interface ProjectsSkeletonProps {
  projectCount?: number
}

export function ProjectsSkeleton({ projectCount = 3 }: ProjectsSkeletonProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      {Array.from({ length: projectCount }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 p-2.5 rounded-md"
        >
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-4 flex-1 rounded-md" />
        </div>
      ))}
    </div>
  )
}

