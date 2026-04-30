import { Container, Flex, Heading, HStack } from '@chakra-ui/react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { FeedFilters } from './feed-filters'
import { FeedList } from './feed-list'
import { Suspense } from 'react'

interface Props {
  searchParams: Promise<{
    lookingFor?: string
    industries?: string
    roles?: string
    search?: string
  }>
}

export default async function FeedPage({ searchParams }: Props) {
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
    lookingFor: params.lookingFor?.split(',').filter(Boolean),
    industries: params.industries?.split(',').filter(Boolean),
    roles: params.roles?.split(',').filter(Boolean),
    search: params.search || undefined,
  }

  const profiles = await prisma.profile.findMany({
    where: {
      community: 'emprending',
      visible: true,
      onboardingComplete: true,
      id: { not: session.user.id },
      ...(filters.lookingFor?.length && {
        lookingFor: { hasSome: filters.lookingFor },
      }),
      ...(filters.industries?.length && {
        industries: { hasSome: filters.industries },
      }),
      ...(filters.roles?.length && {
        role: { in: filters.roles },
      }),
      ...(filters.search && {
        OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' as const } },
          { startup: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    },
    take: 30,
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <Container maxW="6xl" py="6">
      <Heading size="xl" mb="6">Miembros</Heading>
      <Flex gap="6" direction={{ base: 'column', lg: 'row' }}>
        <Suspense>
          <FeedFilters />
        </Suspense>
        <FeedList initialProfiles={profiles} filters={filters} />
      </Flex>
    </Container>
  )
}
