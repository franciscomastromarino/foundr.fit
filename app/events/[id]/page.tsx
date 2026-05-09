export const dynamic = 'force-dynamic'

import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getEventById, getEventAttendees } from '../actions'
import { AttendButton } from '../attend-button'
import { AttendeeList } from './attendee-list'
import { CalendarDays, MapPin, Users, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function formatEventDate(date: Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { onboardingComplete: true, onboardingStep: true },
  })

  if (!profile || !profile.onboardingComplete) {
    const step = profile?.onboardingStep ?? 1
    redirect(`/onboarding/step-${step}`)
  }

  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const isAttending = event.attendees.some((a) => a.userId === session.user!.id)
  const isPast = new Date(event.date) < new Date()

  const { attendees, likedIds, matchedIds } = await getEventAttendees(id)

  return (
    <Container maxW="lg" py="6">
      <Stack gap="6">
        {/* Back link */}
        <Link href="/events">
          <HStack gap="1" color="brand.500" fontSize="sm" fontWeight="500">
            <ArrowLeft size={16} />
            <Text>Eventos</Text>
          </HStack>
        </Link>

        {/* Event header */}
        <Stack gap="3">
          <HStack gap="2" color="fg.muted" fontSize="sm">
            <CalendarDays size={16} />
            <Text>{formatEventDate(event.date)}</Text>
          </HStack>

          <Heading size="2xl" lineHeight="1.2">
            {event.title}
          </Heading>

          <HStack gap="4" flexWrap="wrap">
            {event.location && (
              <HStack gap="1" color="fg.muted" fontSize="sm">
                <MapPin size={14} />
                <Text>{event.location}</Text>
              </HStack>
            )}
            <HStack gap="1" color="fg.muted" fontSize="sm">
              <Users size={14} />
              <Text>{event._count.attendees} asistentes</Text>
            </HStack>
          </HStack>

          {/* Industries */}
          {event.industries.length > 0 && (
            <Wrap gap="1.5">
              {event.industries.map((ind) => (
                <Badge
                  key={ind}
                  fontSize="xs"
                  px="2.5"
                  py="1"
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

          {/* Description */}
          {event.description && (
            <Text color="fg.DEFAULT" fontSize="sm" lineHeight="1.6" whiteSpace="pre-wrap">
              {event.description}
            </Text>
          )}

          {/* Action row */}
          <HStack gap="3" pt="1">
            {!isPast && (
              <AttendButton eventId={event.id} initialAttending={isAttending} size="md" />
            )}
            {event.url && (
              <ChakraLink href={event.url} target="_blank">
                <HStack gap="1" color="brand.500" fontSize="sm" fontWeight="500">
                  <ExternalLink size={14} />
                  <Text>Ver evento</Text>
                </HStack>
              </ChakraLink>
            )}
          </HStack>
        </Stack>

        {/* Divider */}
        <Box h="1px" bg="surface.border" />

        {/* Attendees section */}
        <Stack gap="4">
          <Stack gap="1">
            <Heading size="lg">
              {isPast ? 'Asistieron' : 'Van a asistir'}
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              {isAttending
                ? 'Conectá con quienes van al mismo evento'
                : 'Confirmá asistencia para ver perfiles y conectar'}
            </Text>
          </Stack>

          {isAttending ? (
            <AttendeeList
              attendees={attendees}
              likedIds={likedIds}
              matchedIds={matchedIds}
              eventId={event.id}
            />
          ) : (
            <Box
              bg="surface.elevated"
              borderRadius="xl"
              p="8"
              textAlign="center"
            >
              <Text color="fg.muted" fontSize="sm">
                Confirmá tu asistencia para ver quiénes van y enviarles un &quot;Conectar&quot; antes del evento.
              </Text>
            </Box>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
