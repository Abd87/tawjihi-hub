'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PostHogTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    import('posthog-js').then((mod) => {
      const posthog = mod.default
      if (typeof window !== 'undefined' && !posthog.__loaded) {
        posthog.init('phc_yWRCBBj4bEWQY7V4s5EYRtZ3HBPjcPMbCJqreMrKrm8r', {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false,
        })
      }
      
      if (pathname) {
        let url = window.origin + pathname
        if (searchParams?.toString()) {
          url = url + `?${searchParams.toString()}`
        }
        posthog.capture('$pageview', {
          $current_url: url,
        })
      }
    }).catch(err => console.error('Failed to load PostHog', err))
  }, [pathname, searchParams])

  return null
}
