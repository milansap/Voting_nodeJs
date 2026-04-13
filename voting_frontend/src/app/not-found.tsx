'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#059669]/20 dark:bg-[#047857]/20 blur-[120px]" />
      </div>

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] dark:from-[#047857] dark:via-[#059669] dark:to-[#10B981] bg-clip-text text-transparent">
            404
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="w-40 h-40 rounded-full border-2 border-[#059669]/30 dark:border-[#047857]/30 flex items-center justify-center">
            <div className="text-6xl">🗳️</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2 bg-[#059669] hover:bg-[#047857] dark:bg-[#059669] dark:hover:bg-[#047857] text-white px-8"
            asChild
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-[#059669] dark:border-[#047857] text-[#059669] dark:text-[#10B981] hover:bg-[#059669]/10 dark:hover:bg-[#047857]/10 px-8"
            asChild
          >
            <Link href="/candidates">
              <ArrowLeft className="h-5 w-5" />
              View Candidates
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Need help? <a href="/candidates" className="text-[#059669] dark:text-[#10B981] hover:underline font-semibold">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}
