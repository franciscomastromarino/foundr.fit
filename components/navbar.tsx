'use client'

import { Box, Container, HStack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LayoutGrid, Compass, Heart, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/feed', label: 'Miembros', icon: LayoutGrid },
  { href: '/discover', label: 'Descubrir', icon: Compass },
  { href: '/matches', label: 'Matches', icon: Heart },
  { href: '/settings', label: 'Ajustes', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="surface.card"
      borderTopWidth="1px"
      borderColor="surface.border"
      zIndex="10"
      pb="env(safe-area-inset-bottom)"
    >
      <Container maxW="6xl">
        <HStack justify="space-between" py="2" px="4">
          <Box>
            <Link href="/feed">
              <Text fontWeight="bold" fontSize="xl" color="brand.400" fontStyle="italic">
                fr.
              </Text>
            </Link>
          </Box>
          <HStack gap="6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <VStack gap="0.5" align="center" minW="12">
                    <Icon
                      size={20}
                      color={isActive ? '#4318FF' : '#8B8FA3'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <Text
                      fontSize="2xs"
                      color={isActive ? 'brand.400' : 'fg.muted'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {item.label}
                    </Text>
                  </VStack>
                </Link>
              )
            })}
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
