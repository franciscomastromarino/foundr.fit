'use client'

import { Box, Button, Container, HStack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/feed', label: 'Feed' },
  { href: '/discover', label: 'Descubrir' },
  { href: '/matches', label: 'Matches' },
  { href: '/settings', label: 'Perfil' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  return (
    <Box borderBottomWidth="1px" position="sticky" top="0" bg="white" _dark={{ bg: 'gray.900' }} zIndex="10">
      <Container maxW="6xl">
        <HStack justify="space-between" py="2">
          <Button asChild variant="ghost" size="sm" fontWeight="bold">
            <Link href="/feed">FR</Link>
          </Button>
          <HStack gap="1">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname.startsWith(item.href) ? 'solid' : 'ghost'}
                size="sm"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
