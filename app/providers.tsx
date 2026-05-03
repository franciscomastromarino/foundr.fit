'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/lib/theme'
import { SessionProvider } from 'next-auth/react'
import { PHProvider } from './posthog-provider'
import { EmotionCacheProvider } from '@/lib/emotion-cache'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PHProvider>
        <EmotionCacheProvider>
          <ChakraProvider value={system}>{children}</ChakraProvider>
        </EmotionCacheProvider>
      </PHProvider>
    </SessionProvider>
  )
}
