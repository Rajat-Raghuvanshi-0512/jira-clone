import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@/features/auth/components/UserButton'
interface StandaloneLayoutProps {
  children: React.ReactNode
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={50} height={50} />
            <span className="text-2xl font-bold">Jira Clone</span>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  )
}
