'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { PHProvider } from './posthog-provider'
import { EmotionCacheProvider } from '@/lib/emotion-cache'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PHProvider>
        <EmotionCacheProvider>
          <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
        </EmotionCacheProvider>
      </PHProvider>
    </SessionProvider>
  )
}
