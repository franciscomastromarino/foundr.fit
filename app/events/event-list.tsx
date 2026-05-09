'use client'

import { EventCard } from './event-card'
import { Stack, Text } from '@chakra-ui/react'

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

export function EventList({ events }: { events: EventWithMeta[] }) {
  if (events.length === 0) {
    return (
      <Text color="fg.muted" textAlign="center" py="10">
        No hay eventos con estos filtros.
      </Text>
    )
  }

  return (
    <Stack gap="3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isAttending={event.attendees.length > 0}
        />
      ))}
    </Stack>
  )
}
