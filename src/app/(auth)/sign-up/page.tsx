import { SignUpCard } from '@/features/auth/components/SignUpCard'
import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const SignUpPage = async () => {
  const user = await getCurrentUser()
  if (user) {
    return redirect('/')
  }
  return <SignUpCard />
}

export default SignUpPage
