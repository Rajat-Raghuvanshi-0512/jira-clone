import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { QueryProvider } from '@/components/query-provider'

import './globals.css'

const font = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Jira Clone',
  description: 'Jira Clone built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          font.className,
          font.variable,
          'antialiased min-h-screen',
        )}
      >
        <QueryProvider>
          <Toaster />
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  )
}
