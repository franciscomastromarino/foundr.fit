'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { PHProvider } from './posthog-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PHProvider>
        <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
      </PHProvider>
    </SessionProvider>
  )
}
