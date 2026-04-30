'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function getMatches() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  // Find users where BOTH directions of Like exist
  const myLikes = await prisma.like.findMany({
    where: { fromUser: session.user.id },
    select: { toUser: true },
  })
  const likedIds = myLikes.map((l) => l.toUser)

  if (likedIds.length === 0) return []

  // Find which of those users also liked me back
  const mutualLikes = await prisma.like.findMany({
    where: {
      fromUser: { in: likedIds },
      toUser: session.user.id,
    },
    select: { fromUser: true },
  })
  const matchedIds = mutualLikes.map((l) => l.fromUser)

  if (matchedIds.length === 0) return []

  return prisma.profile.findMany({
    where: { id: { in: matchedIds } },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function isMatch(targetId: string) {
  const session = await auth()
  if (!session?.user?.id) return false

  const [iLikedThem, theyLikedMe] = await Promise.all([
    prisma.like.findUnique({
      where: { fromUser_toUser: { fromUser: session.user.id, toUser: targetId } },
    }),
    prisma.like.findUnique({
      where: { fromUser_toUser: { fromUser: targetId, toUser: session.user.id } },
    }),
  ])

  return !!(iLikedThem && theyLikedMe)
}
