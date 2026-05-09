export const dynamic = 'force-dynamic'

import { Container, Heading, Stack, Text, HStack } from '@chakra-ui/react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CreateEventForm } from './create-event-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewEventPage() {
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

  return (
    <Container maxW="lg" py="6">
      <Stack gap="6">
        <Link href="/events">
          <HStack gap="1" color="brand.500" fontSize="sm" fontWeight="500">
            <ArrowLeft size={16} />
            <Text>Eventos</Text>
          </HStack>
        </Link>

        <Stack gap="1">
          <Heading size="xl">Crear evento</Heading>
          <Text fontSize="sm" color="fg.muted">
            Compartí un evento con la comunidad y descubrí quiénes van a asistir
          </Text>
        </Stack>

        <CreateEventForm />
      </Stack>
    </Container>
  )
}
