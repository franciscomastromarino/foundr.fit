'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getFeed(filters: {
  lookingFor?: string[]
  industries?: string[]
  roles?: string[]
  search?: string
  page?: number
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return prisma.profile.findMany({
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
    skip: (filters.page ?? 0) * 30,
    orderBy: { updatedAt: 'desc' },
  })
}
