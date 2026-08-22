'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-stack-md pt-20">
      <div className="bg-error-container text-on-error-container p-6 rounded border border-error max-w-lg text-center">
        <span className="material-symbols-outlined text-[48px] mb-4">error</span>
        <h2 className="font-headline-md text-headline-md mb-2">Something went wrong</h2>
        <p className="font-body-md text-body-md mb-6 opacity-90">
          We encountered an error loading your dashboard. Please try again.
        </p>
        <Button 
          onClick={() => reset()}
          className="bg-error text-on-error hover:bg-error/90"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
