import { MembersListSkeleton } from '@/components/skeletons'

export default function MembersLoading() {
  return (
    <div className="w-full lg:max-w-xl">
      <MembersListSkeleton />
    </div>
  )
}

