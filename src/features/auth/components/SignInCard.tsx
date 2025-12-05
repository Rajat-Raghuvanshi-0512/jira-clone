import SignInForm from './SignInForm'
import Link from 'next/link'
import { DottedSeparator } from '@/components/ui/dotted-separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthProviderButtons } from './AuthProviderButtons'

export const SignInCard = () => {
  return (
    <Card className="w-full -h-full max-w-md border-none shadow-none gap-2">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <SignInForm />
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 space-y-4">
        <AuthProviderButtons />
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <p className="text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
