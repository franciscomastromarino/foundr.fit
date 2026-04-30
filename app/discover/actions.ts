'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getDiscoverProfiles() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  // Get IDs the user already liked or passed
  const alreadyLiked = await prisma.like.findMany({
    where: { fromUser: session.user.id },
    select: { toUser: true },
  })
  const excludeIds = [session.user.id, ...alreadyLiked.map((l) => l.toUser)]

  return prisma.profile.findMany({
    where: {
      community: 'emprending',
      visible: true,
      onboardingComplete: true,
      id: { notIn: excludeIds },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })
}

export async function likeProfile(targetId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.id === targetId) throw new Error('Cannot like self')

  // Create the like (upsert to be safe)
  await prisma.like.upsert({
    where: {
      fromUser_toUser: {
        fromUser: session.user.id,
        toUser: targetId,
      },
    },
    create: {
      fromUser: session.user.id,
      toUser: targetId,
    },
    update: {},
  })

  // Check if it's a mutual like (match)
  const mutualLike = await prisma.like.findUnique({
    where: {
      fromUser_toUser: {
        fromUser: targetId,
        toUser: session.user.id,
      },
    },
  })

  if (mutualLike) {
    // Fetch the matched profile to return info
    const matchedProfile = await prisma.profile.findUnique({
      where: { id: targetId },
      select: { fullName: true, avatarUrl: true },
    })
    return { match: true, matchedName: matchedProfile?.fullName }
  }

  return { match: false }
}

export async function passProfile(targetId: string) {
  // For now, passing doesn't store anything — the user just won't see them again
  // in the current session. On reload they may reappear.
  // To persist passes, we'd add a Pass model. Keeping it simple for MVP.
  return { ok: true }
}
