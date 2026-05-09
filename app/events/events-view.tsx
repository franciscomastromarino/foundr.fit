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
import { CalendarDays, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { EventCalendar, MONTH_NAMES } from './event-calendar'
import { EventList } from './event-list'
import { INDUSTRIES } from '@/lib/constants'
import { ChipSelect } from '@/components/chip-select'
import { getEvents } from './actions'

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
  showAll,
}: {
  initialEvents: EventWithMeta[]
  userIndustries: string[]
  showAll: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [events, setEvents] = useState<EventWithMeta[]>(initialEvents)
  const [loading, setLoading] = useState(false)

  const [forYou, setForYou] = useState(!showAll)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [customIndustries, setCustomIndustries] = useState<string[]>(
    searchParams.get('industries')?.split(',').filter(Boolean) ?? []
  )
  const [showIndustryPicker, setShowIndustryPicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hasCustomFilter = customIndustries.length > 0
  const activeIndustries = hasCustomFilter
    ? customIndustries
    : forYou
    ? userIndustries
    : []

  // Fetch events for the current month + filters
  const fetchEvents = useCallback(async (y: number, m: number, industries: string[], searchTerm: string) => {
    setLoading(true)
    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`
    const result = await getEvents({
      month: monthKey,
      industries: industries.length > 0 ? industries : undefined,
      search: searchTerm.trim() || undefined,
    })
    setEvents(result)
    setLoading(false)
  }, [])

  // Refetch when filters change
  useEffect(() => {
    fetchEvents(year, month, activeIndustries, search)
  }, [year, month, activeIndustries.join(','), search]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeMonth = (y: number, m: number) => {
    setYear(y)
    setMonth(m)
    setSelectedDay(null)
  }

  const handleSelectDay = (day: number | null) => {
    setSelectedDay(day)
  }

  const clearDateFilter = () => {
    setSelectedDay(null)
    // If not on current month, go back to current month
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }

  const toggleForYou = () => {
    const next = !forYou
    setForYou(next)
    setCustomIndustries([])
  }

  const clearAllFilters = () => {
    setForYou(true)
    setCustomIndustries([])
    setSearch('')
    setSelectedDay(null)
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setShowIndustryPicker(false)
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

  // Filter events for the list based on selected day
  const filteredEvents = selectedDay
    ? events.filter((e) => {
        const d = new Date(e.date)
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay
      })
    : events

  // Build date filter label
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
  const dateFilterLabel = selectedDay
    ? `${selectedDay} de ${MONTH_NAMES[month]}`
    : !isCurrentMonth
    ? `${MONTH_NAMES[month]} ${year}`
    : null

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

      {/* Filters row */}
      <Stack gap="3">
        <HStack justify="space-between" align="center">
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

          {/* Industry filter */}
          <Box position="relative" ref={dropdownRef}>
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

            {showIndustryPicker && (
              <Box
                role="dialog"
                aria-label="Filtro: industria"
                position="absolute"
                top="100%"
                right="0"
                mt="2"
                bg="white"
                borderRadius="xl"
                boxShadow="0 4px 20px rgba(0,0,0,0.12)"
                borderWidth="1px"
                borderColor="surface.border"
                p="4"
                zIndex="20"
                minW="280px"
              >
                <Stack gap="3">
                  <Heading size="xs">Industria</Heading>
                  <ChipSelect
                    options={INDUSTRIES}
                    value={customIndustries}
                    onChange={(v) => {
                      setCustomIndustries(v)
                      setForYou(false)
                    }}
                    max={10}
                    colorScheme="green"
                  />
                </Stack>
                <Button
                  onClick={() => setShowIndustryPicker(false)}
                  colorPalette="brand"
                  size="sm"
                  mt="3"
                  w="full"
                  borderRadius="full"
                >
                  Aplicar
                </Button>
              </Box>
            )}
          </Box>
        </HStack>

        {/* User industries badges */}
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
            bg="surface.elevated"
            borderColor="transparent"
            borderRadius="xl"
            pl="9"
            fontSize="sm"
            _placeholder={{ color: 'fg.subtle' }}
            _focus={{ borderColor: 'brand.400', bg: 'white' }}
          />
        </Box>
      </Stack>

      {/* Calendar */}
      <EventCalendar
        events={events}
        year={year}
        month={month}
        selectedDay={selectedDay}
        loading={loading}
        onSelectDay={handleSelectDay}
        onChangeMonth={handleChangeMonth}
      />

      {/* Date filter badge + list header */}
      <Stack gap="3">
        <HStack justify="space-between" align="center">
          <HStack gap="2" align="center">
            <Heading size="md">
              {selectedDay
                ? `${selectedDay} de ${MONTH_NAMES[month]}`
                : `${MONTH_NAMES[month]} ${year}`}
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              ({filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'})
            </Text>
          </HStack>

          {/* Clear date filter button */}
          {(selectedDay || !isCurrentMonth) && (
            <Button
              size="xs"
              variant="outline"
              borderRadius="full"
              onClick={clearDateFilter}
              px="3"
              fontWeight="500"
              borderColor="surface.border"
              color="fg.DEFAULT"
            >
              <CalendarDays size={13} />
              {dateFilterLabel}
              <X size={13} />
            </Button>
          )}
        </HStack>

        {/* Event list */}
        <EventList events={filteredEvents} />
      </Stack>
    </>
  )
}
