'use client'

import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES } from './event-calendar'

type EventMinimal = {
  id: string
  date: Date
  attendees: { id: string }[]
}

const WEEKDAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startWeekday = firstDay.getDay() - 1
  if (startWeekday < 0) startWeekday = 6

  const days: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)

  return days
}

function MiniMonth({
  year,
  month,
  events,
  onSelect,
}: {
  year: number
  month: number
  events: EventMinimal[]
  onSelect: (year: number, month: number) => void
}) {
  const now = new Date()
  const days = getCalendarDays(year, month)
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  // Map day -> has events / attending
  const eventDays = new Map<number, { hasEvent: boolean; attending: boolean }>()
  for (const event of events) {
    const d = new Date(event.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      const existing = eventDays.get(day)
      eventDays.set(day, {
        hasEvent: true,
        attending: (existing?.attending ?? false) || event.attendees.length > 0,
      })
    }
  }

  const eventCount = new Set(events.filter((e) => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  }).map((e) => e.id)).size

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor={isCurrentMonth ? 'brand.300' : 'surface.border'}
      borderRadius="lg"
      p="2"
      cursor="pointer"
      onClick={() => onSelect(year, month)}
      transition="all 0.15s"
      _hover={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderColor: 'brand.300' }}
    >
      <Stack gap="1">
        {/* Month name */}
        <HStack justify="space-between" align="center" px="0.5">
          <Text
            fontSize="xs"
            fontWeight="600"
            color={isCurrentMonth ? 'brand.500' : 'fg.DEFAULT'}
          >
            {MONTH_NAMES[month].slice(0, 3)}
          </Text>
          {eventCount > 0 && (
            <Text fontSize="2xs" color="fg.muted">
              {eventCount}
            </Text>
          )}
        </HStack>

        {/* Weekday headers */}
        <Grid templateColumns="repeat(7, 1fr)" gap="0">
          {WEEKDAYS_SHORT.map((d) => (
            <GridItem key={d} textAlign="center">
              <Text fontSize="3xs" color="fg.subtle" lineHeight="1.4">
                {d}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {/* Days */}
        <Grid templateColumns="repeat(7, 1fr)" gap="0">
          {days.map((day, idx) => {
            const info = day !== null ? eventDays.get(day) : undefined
            const isToday = day !== null &&
              now.getFullYear() === year &&
              now.getMonth() === month &&
              now.getDate() === day

            return (
              <GridItem key={idx} textAlign="center" py="0.5">
                {day !== null && (
                  <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
                    <Text
                      fontSize="3xs"
                      lineHeight="1"
                      w="4"
                      h="4"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      bg={isToday ? 'brand.500' : 'transparent'}
                      color={isToday ? 'white' : 'fg.DEFAULT'}
                      fontWeight={isToday || info?.hasEvent ? '700' : '400'}
                    >
                      {day}
                    </Text>
                    {info?.hasEvent && (
                      <Box
                        position="absolute"
                        bottom="-1px"
                        left="50%"
                        transform="translateX(-50%)"
                        w="1"
                        h="1"
                        borderRadius="full"
                        bg={info.attending ? 'green.400' : 'brand.400'}
                      />
                    )}
                  </Box>
                )}
              </GridItem>
            )
          })}
        </Grid>
      </Stack>
    </Box>
  )
}

export function YearView({
  year,
  events,
  loading,
  onSelectMonth,
  onChangeYear,
}: {
  year: number
  events: EventMinimal[]
  loading: boolean
  onSelectMonth: (year: number, month: number) => void
  onChangeYear: (year: number) => void
}) {
  const now = new Date()
  const isCurrentYear = year === now.getFullYear()

  return (
    <Stack gap="3">
      {/* Year navigation */}
      <HStack justify="space-between" align="center">
        <Button variant="ghost" size="sm" onClick={() => onChangeYear(year - 1)} aria-label="Año anterior" px="2">
          <ChevronLeft size={18} />
        </Button>

        <HStack gap="2" align="center">
          <Heading size="md">{year}</Heading>
          {!isCurrentYear && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onChangeYear(now.getFullYear())}
              color="brand.500"
              fontWeight="500"
            >
              Hoy
            </Button>
          )}
        </HStack>

        <Button variant="ghost" size="sm" onClick={() => onChangeYear(year + 1)} aria-label="Año siguiente" px="2">
          <ChevronRight size={18} />
        </Button>
      </HStack>

      {/* 12 mini months in a 3x4 grid */}
      <Box opacity={loading ? 0.6 : 1} transition="opacity 0.2s">
        <Grid templateColumns="repeat(3, 1fr)" gap="2">
          {Array.from({ length: 12 }, (_, m) => (
            <MiniMonth
              key={m}
              year={year}
              month={m}
              events={events}
              onSelect={onSelectMonth}
            />
          ))}
        </Grid>
      </Box>

      {/* Legend */}
      <HStack gap="4" justify="center">
        <HStack gap="1.5" fontSize="xs" color="fg.muted">
          <Box w="2" h="2" borderRadius="full" bg="brand.400" />
          <Text>Evento</Text>
        </HStack>
        <HStack gap="1.5" fontSize="xs" color="fg.muted">
          <Box w="2" h="2" borderRadius="full" bg="green.400" />
          <Text>Asistís</Text>
        </HStack>
      </HStack>
    </Stack>
  )
}
