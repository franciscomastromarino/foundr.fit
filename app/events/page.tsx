export const dynamic = 'force-dynamic'

import { Container, Stack } from '@chakra-ui/react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getEvents } from './actions'
import { EventsView } from './events-view'

interface Props {
  searchParams: Promise<{
    industries?: string
    search?: string
    all?: string
  }>
}

export default async function EventsPage({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { onboardingComplete: true, onboardingStep: true, industries: true },
  })

  if (!profile || !profile.onboardingComplete) {
    const step = profile?.onboardingStep ?? 1
    redirect(`/onboarding/step-${step}`)
  }

  const params = await searchParams
  const showAll = params.all === '1'

  const explicitIndustries = params.industries?.split(',').filter(Boolean)
  const activeIndustries = explicitIndustries ?? (showAll ? [] : profile.industries)

  // Load current month events for initial render
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const events = await getEvents({
    month: monthKey,
    industries: activeIndustries.length > 0 ? activeIndustries : undefined,
    search: params.search || undefined,
  })

  return (
    <Container maxW="lg" py="6">
      <Stack gap="5">
        <EventsView
          initialEvents={events}
          userIndustries={profile.industries}
          showAll={showAll}
        />
      </Stack>
    </Container>
  )
}
