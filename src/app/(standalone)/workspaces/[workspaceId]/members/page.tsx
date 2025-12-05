import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/queries'
import { MembersList } from '@/features/members/components/members-list'
export default async function MembersPage() {
  const user = await getCurrentUser()
  if (!user) {
    return redirect('/sign-in')
  }
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  )
}
