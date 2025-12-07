import {
  SettingsFormSkeleton,
  InviteMembersSkeleton,
  DangerZoneSkeleton,
} from '@/components/skeletons'

export default function SettingsLoading() {
  return (
    <div className="w-full lg:max-w-xl">
      <div className="flex flex-col gap-y-4">
        <SettingsFormSkeleton />
        <InviteMembersSkeleton />
        <DangerZoneSkeleton />
      </div>
    </div>
  )
}

