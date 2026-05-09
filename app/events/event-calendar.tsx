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

type EventWithMeta = {
  id: string
  date: Date
  attendees: { id: string }[]
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

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

function isSameDay(year: number, month: number, day: number, ref: Date): boolean {
  return ref.getFullYear() === year && ref.getMonth() === month && ref.getDate() === day
}

export function EventCalendar({
  events,
  year,
  month,
  selectedDay,
  loading,
  onSelectDay,
  onChangeMonth,
  onToggleYearView,
}: {
  events: EventWithMeta[]
  year: number
  month: number
  selectedDay: number | null
  loading: boolean
  onSelectDay: (day: number | null) => void
  onChangeMonth: (year: number, month: number) => void
  onToggleYearView?: () => void
}) {
  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const goToPrevMonth = () => {
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    onChangeMonth(y, m)
  }

  const goToNextMonth = () => {
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    onChangeMonth(y, m)
  }

  const goToToday = () => {
    onChangeMonth(now.getFullYear(), now.getMonth())
    onSelectDay(now.getDate())
  }

  const days = getCalendarDays(year, month)

  // Map day -> events
  const eventsByDay = new Map<number, EventWithMeta[]>()
  for (const event of events) {
    const d = new Date(event.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay.has(day)) eventsByDay.set(day, [])
      eventsByDay.get(day)!.push(event)
    }
  }

  return (
    <Stack gap="3">
      {/* Month navigation */}
      <HStack justify="space-between" align="center">
        <Button variant="ghost" size="sm" onClick={goToPrevMonth} aria-label="Mes anterior" px="2">
          <ChevronLeft size={18} />
        </Button>

        <HStack gap="2" align="center">
          <Heading
            size="md"
            cursor={onToggleYearView ? 'pointer' : 'default'}
            onClick={onToggleYearView}
            _hover={onToggleYearView ? { color: 'brand.500' } : {}}
            transition="color 0.15s"
          >
            {MONTH_NAMES[month]} {year}
          </Heading>
          {!isCurrentMonth && (
            <Button variant="ghost" size="xs" onClick={goToToday} color="brand.500" fontWeight="500">
              Hoy
            </Button>
          )}
        </HStack>

        <Button variant="ghost" size="sm" onClick={goToNextMonth} aria-label="Mes siguiente" px="2">
          <ChevronRight size={18} />
        </Button>
      </HStack>

      {/* Calendar grid */}
      <Box
        bg="white"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="surface.border"
        overflow="hidden"
        opacity={loading ? 0.6 : 1}
        transition="opacity 0.2s"
      >
        {/* Weekday headers */}
        <Grid templateColumns="repeat(7, 1fr)" borderBottomWidth="1px" borderColor="surface.border">
          {WEEKDAYS.map((day) => (
            <GridItem key={day} py="2" textAlign="center">
              <Text fontSize="xs" fontWeight="600" color="fg.muted">
                {day}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {/* Day cells */}
        <Grid templateColumns="repeat(7, 1fr)">
          {days.map((day, idx) => {
            const hasEvents = day !== null && eventsByDay.has(day)
            const dayEvents = day !== null ? (eventsByDay.get(day) ?? []) : []
            const isSelected = day === selectedDay
            const isTodayCell = day !== null && isSameDay(year, month, day, now)
            const isPast = day !== null && new Date(year, month, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate())

            return (
              <GridItem
                key={idx}
                py="2"
                px="1"
                minH="12"
                textAlign="center"
                cursor={day !== null ? 'pointer' : 'default'}
                bg={isSelected ? 'brand.50' : 'transparent'}
                borderBottomWidth="1px"
                borderRightWidth={idx % 7 !== 6 ? '1px' : '0'}
                borderColor="surface.border"
                onClick={() => day !== null && onSelectDay(isSelected ? null : day)}
                transition="background 0.15s"
                _hover={day !== null ? { bg: isSelected ? 'brand.50' : 'gray.50' } : {}}
              >
                {day !== null && (
                  <Stack gap="1" align="center">
                    <Box
                      w="7"
                      h="7"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={isTodayCell ? 'brand.500' : 'transparent'}
                      color={isTodayCell ? 'white' : isPast ? 'fg.subtle' : 'fg.DEFAULT'}
                      fontWeight={isTodayCell || hasEvents ? '600' : '400'}
                    >
                      <Text fontSize="sm">{day}</Text>
                    </Box>
                    {hasEvents && (
                      <HStack gap="0.5" justify="center" minH="2">
                        {dayEvents.slice(0, 3).map((ev, i) => (
                          <Box
                            key={i}
                            w="1.5"
                            h="1.5"
                            borderRadius="full"
                            bg={ev.attendees.length > 0 ? 'green.400' : 'brand.400'}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <Text fontSize="2xs" color="fg.subtle" lineHeight="1">
                            +{dayEvents.length - 3}
                          </Text>
                        )}
                      </HStack>
                    )}
                  </Stack>
                )}
              </GridItem>
            )
          })}
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
