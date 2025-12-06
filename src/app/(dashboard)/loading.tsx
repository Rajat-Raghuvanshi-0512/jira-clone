import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="w-full h-full flex">
        {/* Sidebar Skeleton */}
        <div className="fixed left-0 top-0 hidden lg:block w-64 h-full overflow-y-auto">
          <div className="h-full bg-neutral-100 p-4 w-full">
            {/* Logo Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="size-12 rounded-md" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Separator */}
            <div className="my-4">
              <Skeleton className="h-px w-full" />
            </div>

            {/* Workspace Switcher Skeleton */}
            <Skeleton className="h-10 w-full rounded-md mb-4" />

            {/* Separator */}
            <div className="my-4">
              <Skeleton className="h-px w-full" />
            </div>

            {/* Navigation Skeleton */}
            <div className="flex flex-col gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>

            {/* Separator */}
            <div className="my-4">
              <Skeleton className="h-px w-full" />
            </div>

            {/* Projects Skeleton */}
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-5 rounded" />
              </div>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            {/* Navbar Skeleton */}
            <div className="pt-4 px-6 flex items-center justify-between mb-8">
              <div className="flex-col hidden lg:flex gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="lg:hidden size-10 rounded-md" />
                <Skeleton className="size-10 rounded-full" />
              </div>
            </div>

            {/* Main Content Area Skeleton */}
            <main className="h-full py-8 px-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="size-10 rounded-md" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>

              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
