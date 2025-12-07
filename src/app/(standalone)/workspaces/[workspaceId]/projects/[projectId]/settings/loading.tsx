import {
  SettingsFormSkeleton,
  DangerZoneSkeleton,
} from '@/components/skeletons'

export default function ProjectSettingsLoading() {
  return (
    <div className="w-full lg:max-w-xl">
      <div className="flex flex-col gap-y-4">
        <SettingsFormSkeleton />
        <DangerZoneSkeleton />
      </div>
    </div>
  )
}

