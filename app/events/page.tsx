export const dynamic = 'force-dynamic'

import { Container, Heading, Stack, Text, HStack, Button } from '@chakra-ui/react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getEvents } from './actions'
import { EventList } from './event-list'
import { EventFilters } from './event-filters'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Props {
  searchParams: Promise<{
    industries?: string
    search?: string
    past?: string
  }>
}

export default async function EventsPage({ searchParams }: Props) {
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

  const params = await searchParams
  const filters = {
    industries: params.industries?.split(',').filter(Boolean),
    search: params.search || undefined,
    past: params.past === '1',
  }

  const events = await getEvents(filters)

  return (
    <Container maxW="lg" py="6">
      <Stack gap="5">
        <HStack justify="space-between" align="start">
          <Stack gap="1">
            <Heading size="xl">Eventos</Heading>
            <Text fontSize="sm" color="fg.muted">
              Descubrí eventos y conectá con quienes asisten
            </Text>
          </Stack>
          <Button asChild colorPalette="brand" size="sm" borderRadius="full">
            <Link href="/events/new">
              <Plus size={16} />
              Crear
            </Link>
          </Button>
        </HStack>

        <Suspense>
          <EventFilters />
        </Suspense>

        <EventList events={events} />
      </Stack>
    </Container>
  )
}
