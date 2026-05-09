'use client'

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, List, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { EventList } from './event-list'
import { EventCalendar } from './event-calendar'
import { INDUSTRIES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'

type EventWithMeta = {
  id: string
  title: string
  description: string | null
  date: Date
  endDate: Date | null
  location: string | null
  url: string | null
  industries: string[]
  _count: { attendees: number }
  attendees: { id: string }[]
}

export function EventsView({
  initialEvents,
  userIndustries,
  initialView,
  showAll,
}: {
  initialEvents: EventWithMeta[]
  userIndustries: string[]
  initialView: 'list' | 'calendar'
  showAll: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [view, setView] = useState<'list' | 'calendar'>(initialView)
  const [forYou, setForYou] = useState(!showAll)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [customIndustries, setCustomIndustries] = useState<string[]>(
    searchParams.get('industries')?.split(',').filter(Boolean) ?? []
  )
  const [showIndustryPicker, setShowIndustryPicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hasCustomFilter = customIndustries.length > 0

  // The active industries: custom > forYou (user's) > all
  const activeIndustries = hasCustomFilter
    ? customIndustries
    : forYou
    ? userIndustries
    : []

  const applyFilters = useCallback((overrides?: { forYou?: boolean; industries?: string[]; search?: string }) => {
    const params = new URLSearchParams()
    params.set('view', view)

    const fy = overrides?.forYou ?? forYou
    const ind = overrides?.industries ?? customIndustries
    const s = overrides?.search ?? search

    if (!fy && ind.length === 0) params.set('all', '1')
    if (ind.length > 0) params.set('industries', ind.join(','))
    if (s.trim()) params.set('search', s.trim())

    router.push(`/events?${params.toString()}`)
    setShowIndustryPicker(false)
  }, [view, forYou, customIndustries, search, router])

  const toggleForYou = () => {
    const next = !forYou
    setForYou(next)
    setCustomIndustries([])
    applyFilters({ forYou: next, industries: [] })
  }

  const clearAll = () => {
    setForYou(true)
    setCustomIndustries([])
    setSearch('')
    router.push(`/events?view=${view}`)
    setShowIndustryPicker(false)
  }

  const handleViewToggle = (v: 'list' | 'calendar') => {
    setView(v)
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', v)
    router.push(`/events?${params.toString()}`)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowIndustryPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applyFilters()
  }

  return (
    <>
      {/* Header */}
      <HStack justify="space-between" align="start">
        <Stack gap="1">
          <Heading size="xl">Eventos</Heading>
          <Text fontSize="sm" color="fg.muted">
            {forYou && !hasCustomFilter
              ? 'Eventos para tu industria'
              : 'Descubrí eventos y conectá con quienes asisten'}
          </Text>
        </Stack>
        <Button asChild colorPalette="brand" size="sm" borderRadius="full">
          <Link href="/events/new">
            <Plus size={16} />
            Crear
          </Link>
        </Button>
      </HStack>

      {/* View toggle + "Para ti" badge */}
      <Stack gap="3">
        <HStack justify="space-between" align="center">
          {/* View toggle */}
          <HStack
            gap="0"
            bg="surface.elevated"
            borderRadius="lg"
            p="0.5"
          >
            <Button
              size="xs"
              variant={view === 'calendar' ? 'solid' : 'ghost'}
              colorPalette={view === 'calendar' ? 'brand' : undefined}
              borderRadius="md"
              onClick={() => handleViewToggle('calendar')}
              px="3"
            >
              <CalendarDays size={14} />
              Calendario
            </Button>
            <Button
              size="xs"
              variant={view === 'list' ? 'solid' : 'ghost'}
              colorPalette={view === 'list' ? 'brand' : undefined}
              borderRadius="md"
              onClick={() => handleViewToggle('list')}
              px="3"
            >
              <List size={14} />
              Lista
            </Button>
          </HStack>

          {/* "Para ti" toggle */}
          <Button
            size="xs"
            variant={forYou && !hasCustomFilter ? 'solid' : 'outline'}
            colorPalette={forYou && !hasCustomFilter ? 'green' : undefined}
            borderRadius="full"
            onClick={toggleForYou}
            px="3"
            fontWeight="500"
            borderColor={forYou && !hasCustomFilter ? undefined : 'surface.border'}
          >
            {forYou && !hasCustomFilter ? 'Para ti' : 'Todos'}
          </Button>
        </HStack>

        {/* User industries info when "Para ti" is active */}
        {forYou && !hasCustomFilter && userIndustries.length > 0 && (
          <Wrap gap="1.5">
            {userIndustries.map((ind) => (
              <Badge
                key={ind}
                fontSize="2xs"
                px="2"
                py="0.5"
                borderRadius="full"
                bg="green.50"
                color="green.700"
                fontWeight="500"
              >
                {ind}
              </Badge>
            ))}
          </Wrap>
        )}

        {/* Search bar */}
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

        {/* Industry filter */}
        <Box position="relative" ref={dropdownRef}>
          <HStack gap="2">
            <Button
              size="xs"
              variant={hasCustomFilter ? 'solid' : 'outline'}
              colorPalette={hasCustomFilter ? 'brand' : undefined}
              borderRadius="full"
              onClick={() => setShowIndustryPicker(!showIndustryPicker)}
              flexShrink={0}
              px="3"
              fontWeight="500"
              borderColor={hasCustomFilter ? undefined : 'surface.border'}
              color={hasCustomFilter ? undefined : 'fg.DEFAULT'}
            >
              Industria{hasCustomFilter && ` (${customIndustries.length})`}
            </Button>

            {(hasCustomFilter || search) && (
              <Button
                variant="ghost"
                size="xs"
                color="fg.muted"
                onClick={clearAll}
                flexShrink={0}
              >
                <X size={14} />
                Limpiar
              </Button>
            )}
          </HStack>

          {showIndustryPicker && (
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
                <ChipSelect
                  options={INDUSTRIES}
                  value={customIndustries}
                  onChange={setCustomIndustries}
                  max={10}
                  colorScheme="green"
                />
              </Stack>
              <Button
                onClick={() => {
                  setForYou(false)
                  applyFilters({ forYou: false, industries: customIndustries })
                }}
                colorPalette="brand"
                size="sm"
                mt="3"
                w="full"
                borderRadius="full"
              >
                Aplicar filtros
              </Button>
            </Box>
          )}
        </Box>
      </Stack>

      {/* View content */}
      {view === 'calendar' ? (
        <EventCalendar
          initialEvents={initialEvents}
          userIndustries={userIndustries}
          activeIndustries={activeIndustries}
        />
      ) : (
        <EventList events={initialEvents} />
      )}
    </>
  )
}
