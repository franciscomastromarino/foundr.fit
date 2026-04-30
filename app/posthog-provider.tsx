'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
  })
}

function PostHogIdentify() {
  const { data: session } = useSession()
  const identified = useRef(false)

  useEffect(() => {
    if (session?.user && !identified.current) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      })
      identified.current = true
    }
  }, [session])

  return null
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogIdentify />
      {children}
    </PostHogProvider>
  )
}
