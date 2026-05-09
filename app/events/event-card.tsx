'use client'

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import Link from 'next/link'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { AttendButton } from './attend-button'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string | null
    date: Date
    endDate: Date | null
    location: string | null
    industries: string[]
    _count: { attendees: number }
  }
  isAttending: boolean
}

function formatEventDate(date: Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventCard({ event, isAttending }: EventCardProps) {
  const isPast = new Date(event.date) < new Date()

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="surface.border"
      borderRadius="xl"
      p="4"
      opacity={isPast ? 0.6 : 1}
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: isPast ? undefined : '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      <Stack gap="3">
        {/* Date badge + title */}
        <Stack gap="1">
          <HStack gap="2" color="fg.muted" fontSize="xs">
            <CalendarDays size={14} />
            <Text>{formatEventDate(event.date)}</Text>
            {event.location && (
              <>
                <Box w="1px" h="3" bg="surface.border" />
                <MapPin size={14} />
                <Text>{event.location}</Text>
              </>
            )}
          </HStack>
          <Heading size="sm" lineHeight="1.3">
            {event.title}
          </Heading>
        </Stack>

        {/* Description */}
        {event.description && (
          <Text fontSize="sm" color="fg.muted" lineClamp={2}>
            {event.description}
          </Text>
        )}

        {/* Industry badges */}
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

        {/* Footer: attendee count + actions */}
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
