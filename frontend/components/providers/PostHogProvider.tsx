'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize in the browser, and only once
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init('phc_yWRCBBj4bEWQY7V4s5EYRtZ3HBPjcPMbCJqreMrKrm8r', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        capture_pageview: false, // We handle this manually in Next.js
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
