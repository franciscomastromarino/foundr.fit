'use client'

import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Heading,
} from '@chakra-ui/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, useRef, useEffect } from 'react'
import { INDUSTRIES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { Search, ChevronDown, X } from 'lucide-react'

export function EventFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [industries, setIndustries] = useState<string[]>(
    searchParams.get('industries')?.split(',').filter(Boolean) ?? []
  )
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [showPast, setShowPast] = useState(searchParams.get('past') === '1')
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeCount = industries.length

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (industries.length) params.set('industries', industries.join(','))
    if (search.trim()) params.set('search', search.trim())
    if (showPast) params.set('past', '1')
    router.push(`/events?${params.toString()}`)
    setOpenDropdown(false)
  }, [industries, search, showPast, router])

  const clearFilters = useCallback(() => {
    setIndustries([])
    setSearch('')
    setShowPast(false)
    router.push('/events')
    setOpenDropdown(false)
  }, [router])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applyFilters()
  }

  return (
    <Stack gap="3" w="full">
      <Box position="relative">
        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="fg.subtle" zIndex="1">
          <Search size={16} />
        </Box>
        <Input
          placeholder="Buscar eventos..."
          aria-label="Buscar eventos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
          bg="surface.elevated"
          borderColor="transparent"
          borderRadius="xl"
          pl="9"
          fontSize="sm"
          _placeholder={{ color: 'fg.subtle' }}
          _focus={{ borderColor: 'brand.400', bg: 'white' }}
        />
      </Box>

      <Box position="relative" ref={dropdownRef}>
        <HStack gap="2" overflowX="auto" pb="1" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          <Button
            size="xs"
            variant={activeCount > 0 ? 'solid' : 'outline'}
            colorPalette={activeCount > 0 ? 'brand' : undefined}
            borderRadius="full"
            onClick={() => setOpenDropdown(!openDropdown)}
            flexShrink={0}
            px="3"
            fontWeight="500"
            bg={activeCount > 0 ? undefined : openDropdown ? 'brand.50' : 'transparent'}
            borderColor={openDropdown ? 'brand.400' : activeCount > 0 ? undefined : 'surface.border'}
            color={activeCount > 0 ? undefined : 'fg.DEFAULT'}
            aria-expanded={openDropdown}
            aria-haspopup="dialog"
          >
            Industria
            {activeCount > 0 && ` (${activeCount})`}
            <ChevronDown size={14} style={{ transform: openDropdown ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
          </Button>

          <Button
            size="xs"
            variant={showPast ? 'solid' : 'outline'}
            colorPalette={showPast ? 'brand' : undefined}
            borderRadius="full"
            flexShrink={0}
            px="3"
            fontWeight="500"
            borderColor="surface.border"
            color={showPast ? undefined : 'fg.DEFAULT'}
            onClick={() => {
              setShowPast(!showPast)
              setTimeout(() => {
                const params = new URLSearchParams()
                if (industries.length) params.set('industries', industries.join(','))
                if (search.trim()) params.set('search', search.trim())
                if (!showPast) params.set('past', '1')
                router.push(`/events?${params.toString()}`)
              }, 0)
            }}
          >
            Pasados
          </Button>

          {(activeCount > 0 || search) && (
            <Button
              variant="ghost"
              size="xs"
              color="fg.muted"
              onClick={clearFilters}
              flexShrink={0}
              aria-label="Limpiar todos los filtros"
            >
              <X size={14} />
              Limpiar
            </Button>
          )}
        </HStack>

        {openDropdown && (
          <Box
            role="dialog"
            aria-label="Filtro: industria"
            position="absolute"
            top="100%"
            left="0"
            right="0"
            mt="2"
            bg="white"
            borderRadius="xl"
            boxShadow="0 4px 20px rgba(0,0,0,0.12)"
            borderWidth="1px"
            borderColor="surface.border"
            p="4"
            zIndex="20"
          >
            <Stack gap="3">
              <Heading size="xs">Industria</Heading>
              <ChipSelect options={INDUSTRIES} value={industries} onChange={setIndustries} max={10} colorScheme="green" />
            </Stack>
            <Button onClick={applyFilters} colorPalette="brand" size="sm" mt="3" w="full" borderRadius="full">
              Aplicar filtros
            </Button>
          </Box>
        )}
      </Box>
    </Stack>
  )
}
