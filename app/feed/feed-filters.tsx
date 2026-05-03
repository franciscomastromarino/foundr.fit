'use client'

import {
  Button,
  Heading,
  Input,
  Stack,
  Box,
} from '@chakra-ui/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { INTENTS, INDUSTRIES, ROLES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { Search } from 'lucide-react'

function FilterContent({
  lookingFor,
  setLookingFor,
  industries,
  setIndustries,
  roles,
  setRoles,
  search,
  setSearch,
  onApply,
  onClear,
}: {
  lookingFor: string[]
  setLookingFor: (v: string[]) => void
  industries: string[]
  setIndustries: (v: string[]) => void
  roles: string[]
  setRoles: (v: string[]) => void
  search: string
  setSearch: (v: string) => void
  onApply: () => void
  onClear: () => void
}) {
  return (
    <Stack gap="4">
      <Box position="relative">
        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.muted" zIndex="1">
          <Search size={16} />
        </Box>
        <Input
          placeholder="Buscar nombre o startup..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="surface.input"
          borderColor="surface.border"
          pl="9"
          _placeholder={{ color: 'fg.subtle' }}
        />
      </Box>
      <Box>
        <Heading size="xs" mb="2">Qué buscan</Heading>
        <ChipSelect options={INTENTS} value={lookingFor} onChange={setLookingFor} max={7} />
      </Box>
      <Box>
        <Heading size="xs" mb="2">Industria</Heading>
        <ChipSelect options={INDUSTRIES} value={industries} onChange={setIndustries} max={10} />
      </Box>
      <Box>
        <Heading size="xs" mb="2">Rol</Heading>
        <ChipSelect options={ROLES} value={roles} onChange={setRoles} max={10} />
      </Box>
      <Stack direction="row" gap="2">
        <Button onClick={onApply} flex="1" colorPalette="brand">Filtrar</Button>
        <Button onClick={onClear} variant="outline" flex="1">Limpiar</Button>
      </Stack>
    </Stack>
  )
}

export function FeedFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [lookingFor, setLookingFor] = useState<string[]>(
    searchParams.get('lookingFor')?.split(',').filter(Boolean) ?? []
  )
  const [industries, setIndustries] = useState<string[]>(
    searchParams.get('industries')?.split(',').filter(Boolean) ?? []
  )
  const [roles, setRoles] = useState<string[]>(
    searchParams.get('roles')?.split(',').filter(Boolean) ?? []
  )
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (lookingFor.length) params.set('lookingFor', lookingFor.join(','))
    if (industries.length) params.set('industries', industries.join(','))
    if (roles.length) params.set('roles', roles.join(','))
    if (search.trim()) params.set('search', search.trim())
    router.push(`/feed?${params.toString()}`)
    setShowMobileFilters(false)
  }, [lookingFor, industries, roles, search, router])

  const clearFilters = useCallback(() => {
    setLookingFor([])
    setIndustries([])
    setRoles([])
    setSearch('')
    router.push('/feed')
    setShowMobileFilters(false)
  }, [router])

  const filterProps = {
    lookingFor, setLookingFor,
    industries, setIndustries,
    roles, setRoles,
    search, setSearch,
    onApply: applyFilters,
    onClear: clearFilters,
  }

  return (
    <>
      {/* Mobile: toggle button + collapsible */}
      <Box display={{ base: 'block', lg: 'none' }} mb="4">
        <Button
          variant="outline"
          w="full"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          {showMobileFilters ? 'Ocultar filtros' : 'Filtros'}
        </Button>
        {showMobileFilters && (
          <Box mt="4" p="4" bg="surface.card" borderWidth="1px" borderColor="surface.border" borderRadius="xl">
            <FilterContent {...filterProps} />
          </Box>
        )}
      </Box>

      {/* Desktop: sidebar */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="280px"
        flexShrink={0}
        p="4"
        bg="surface.card"
        borderWidth="1px"
        borderColor="surface.border"
        borderRadius="xl"
        alignSelf="start"
        position="sticky"
        top="4"
      >
        <FilterContent {...filterProps} />
      </Box>
    </>
  )
}
