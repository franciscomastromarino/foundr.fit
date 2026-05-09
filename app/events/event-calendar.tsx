'use client'

import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Users } from 'lucide-react'
import { getEvents } from './actions'
import { AttendButton } from './attend-button'
import Link from 'next/link'

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

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday=0 based
  let startWeekday = firstDay.getDay() - 1
  if (startWeekday < 0) startWeekday = 6

  const days: (number | null)[] = []

  // Leading empty cells
  for (let i = 0; i < startWeekday; i++) {
    days.push(null)
  }

  // Actual days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(d)
  }

  return days
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date()
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day
}

export function EventCalendar({
  initialEvents,
  userIndustries,
  activeIndustries,
}: {
  initialEvents: EventWithMeta[]
  userIndustries: string[]
  activeIndustries: string[]
}) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [events, setEvents] = useState<EventWithMeta[]>(initialEvents)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const fetchMonth = useCallback(async (y: number, m: number) => {
    setLoading(true)
    const result = await getEvents({
      month: getMonthKey(y, m),
      industries: activeIndustries.length > 0 ? activeIndustries : undefined,
    })
    setEvents(result)
    setLoading(false)
  }, [activeIndustries])

  // Refetch when industries filter changes
  useEffect(() => {
    fetchMonth(year, month)
  }, [activeIndustries.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const goToPrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1
    const newYear = month === 0 ? year - 1 : year
    setMonth(newMonth)
    setYear(newYear)
    setSelectedDay(null)
    fetchMonth(newYear, newMonth)
  }

  const goToNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1
    const newYear = month === 11 ? year + 1 : year
    setMonth(newMonth)
    setYear(newYear)
    setSelectedDay(null)
    fetchMonth(newYear, newMonth)
  }

  const goToToday = () => {
    setMonth(now.getMonth())
    setYear(now.getFullYear())
    setSelectedDay(now.getDate())
    fetchMonth(now.getFullYear(), now.getMonth())
  }

  const days = getCalendarDays(year, month)

  // Map day number -> events on that day
  const eventsByDay = new Map<number, EventWithMeta[]>()
  for (const event of events) {
    const d = new Date(event.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay.has(day)) eventsByDay.set(day, [])
      eventsByDay.get(day)!.push(event)
    }
  }

  const selectedEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : []

  return (
    <Stack gap="4">
      {/* Month navigation */}
      <HStack justify="space-between" align="center">
        <Button variant="ghost" size="sm" onClick={goToPrevMonth} aria-label="Mes anterior" px="2">
          <ChevronLeft size={18} />
        </Button>

        <HStack gap="2" align="center">
          <Heading size="md">
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
            const isTodayCell = day !== null && isToday(year, month, day)
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
                onClick={() => day !== null && setSelectedDay(isSelected ? null : day)}
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
                    {/* Event dots */}
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

      {/* Selected day events */}
      {selectedDay !== null && (
        <Stack gap="3">
          <Heading size="sm" color="fg.muted">
            {selectedDay} de {MONTH_NAMES[month]}
          </Heading>

          {selectedEvents.length === 0 ? (
            <Box bg="surface.elevated" borderRadius="xl" p="6" textAlign="center">
              <Text color="fg.muted" fontSize="sm">
                No hay eventos este día.
              </Text>
            </Box>
          ) : (
            selectedEvents.map((event) => (
              <DayEventCard key={event.id} event={event} />
            ))
          )}
        </Stack>
      )}
    </Stack>
  )
}

function DayEventCard({ event }: { event: EventWithMeta }) {
  const isAttending = event.attendees.length > 0
  const isPast = new Date(event.date) < new Date()

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor={isAttending ? 'green.200' : 'surface.border'}
      borderRadius="xl"
      p="4"
      opacity={isPast ? 0.6 : 1}
      _hover={{ boxShadow: isPast ? undefined : '0 2px 12px rgba(0,0,0,0.08)' }}
      transition="box-shadow 0.2s"
    >
      <Stack gap="2">
        <HStack gap="2" color="fg.muted" fontSize="xs">
          <CalendarDays size={14} />
          <Text>{formatTime(event.date)}</Text>
          {event.location && (
            <>
              <Box w="1px" h="3" bg="surface.border" />
              <MapPin size={14} />
              <Text>{event.location}</Text>
            </>
          )}
        </HStack>

        <Heading size="sm" lineHeight="1.3">{event.title}</Heading>

        {event.description && (
          <Text fontSize="sm" color="fg.muted" lineClamp={2}>
            {event.description}
          </Text>
        )}

        {event.industries.length > 0 && (
          <Wrap gap="1.5">
            {event.industries.map((ind) => (
              <Badge
                key={ind}
                fontSize="2xs"
                px="2"
                py="0.5"
                borderRadius="full"
                bg="accent.50"
                color="accent.700"
                fontWeight="500"
              >
                {ind}
              </Badge>
            ))}
          </Wrap>
        )}

        <HStack justify="space-between" align="center">
          <HStack gap="1" color="fg.muted" fontSize="xs">
            <Users size={14} />
            <Text>
              {event._count.attendees} {event._count.attendees === 1 ? 'asistente' : 'asistentes'}
            </Text>
          </HStack>

          <HStack gap="2">
            <Button asChild variant="ghost" size="xs" color="brand.500" fontWeight="500" px="2">
              <Link href={`/events/${event.id}`}>Ver detalle</Link>
            </Button>
            {!isPast && <AttendButton eventId={event.id} initialAttending={isAttending} />}
          </HStack>
        </HStack>
      </Stack>
    </Box>
  )
}
