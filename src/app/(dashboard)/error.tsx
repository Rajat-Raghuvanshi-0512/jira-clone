'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full h-full flex">
        {/* Sidebar space */}
        <div className="fixed left-0 top-0 hidden lg:block w-64 h-full" />

        {/* Main Content */}
        <div className=" w-full flex items-center justify-center">
          <div className="mx-auto max-w-screen-2xl w-full px-6">
            <div className="max-w-md mx-auto text-center space-y-6 py-12">
              <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-4">
                  <AlertCircle className="size-8 text-destructive" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Something went wrong!</h1>
                <p className="text-muted-foreground">
                  An unexpected error occurred. Please try again or contact
                  support if the problem persists.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && error.message && (
                <div className="text-left p-4 bg-destructive/10 rounded-md border border-destructive/20">
                  <p className="text-sm font-semibold text-destructive mb-2">
                    Error Details:
                  </p>
                  <p className="text-sm text-destructive/80 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button onClick={reset} variant="primary">
                  Try again
                </Button>
                <Button
                  onClick={() => (window.location.href = '/')}
                  variant="outline"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
