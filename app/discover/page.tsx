import { Heading, Container } from '@chakra-ui/react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SwipeCards } from './swipe-cards'

export default async function DiscoverPage() {
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

  // Get IDs already liked
  const alreadyLiked = await prisma.like.findMany({
    where: { fromUser: session.user.id },
    select: { toUser: true },
  })
  const excludeIds = [session.user.id, ...alreadyLiked.map((l) => l.toUser)]

  const profiles = await prisma.profile.findMany({
    where: {
      community: 'emprending',
      visible: true,
      onboardingComplete: true,
      id: { notIn: excludeIds },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })

  return (
    <Container maxW="lg" py="6">
      <Heading size="xl" mb="6" textAlign="center">
        Descubrir
      </Heading>
      <SwipeCards initialProfiles={profiles} />
    </Container>
  )
}
