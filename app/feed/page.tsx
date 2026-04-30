import { Container, Heading, Text } from '@chakra-ui/react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function FeedPage() {
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
    <Container maxW="lg" py="10">
      <Heading size="xl">Feed</Heading>
      <Text color="fg.muted" mt="2">
        Placeholder — se implementa en Fase 4.
      </Text>
    </Container>
  )
}
