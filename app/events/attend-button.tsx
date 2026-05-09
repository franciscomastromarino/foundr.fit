'use client'

import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { Check, CalendarPlus } from 'lucide-react'
import { toggleAttendance } from './actions'
import { trackEvent } from '@/lib/analytics'

export function AttendButton({
  eventId,
  initialAttending,
  size = 'sm',
}: {
  eventId: string
  initialAttending: boolean
  size?: 'sm' | 'md'
}) {
  const [attending, setAttending] = useState(initialAttending)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    trackEvent(attending ? 'event_leave' : 'event_join', { event_id: eventId })
    const result = await toggleAttendance(eventId)
    setAttending(result.attending)
    setLoading(false)
  }

  if (attending) {
    return (
      <Button
        colorPalette="green"
        variant="outline"
        size={size}
        borderRadius="full"
        onClick={handleToggle}
        loading={loading}
        px="4"
      >
        <Check size={14} />
        Voy
      </Button>
    )
  }

  return (
    <Button
      colorPalette="brand"
      size={size}
      borderRadius="full"
      onClick={handleToggle}
      loading={loading}
      px="4"
    >
      <CalendarPlus size={14} />
      Asistir
    </Button>
  )
}
