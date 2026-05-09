'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateEventSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().max(120).optional(),
  url: z.string().url().optional(),
  industries: z.array(z.string()).max(3),
})

export async function getEvents(filters?: {
  industries?: string[]
  search?: string
  past?: boolean
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const now = new Date()

  return prisma.event.findMany({
    where: {
      community: 'emprending',
      ...(filters?.past
        ? { date: { lt: now } }
        : { date: { gte: now } }),
      ...(filters?.industries?.length && {
        industries: { hasSome: filters.industries },
      }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    },
    include: {
      _count: { select: { attendees: true } },
      attendees: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
    orderBy: filters?.past
      ? { date: 'desc' }
      : { date: 'asc' },
    take: 50,
  })
}

export async function getEventById(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      creator: {
        select: { id: true, name: true, image: true },
      },
      _count: { select: { attendees: true } },
      attendees: {
        select: { id: true, userId: true },
      },
    },
  })

  return event
}

export async function getEventAttendees(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const attendees = await prisma.eventAttendee.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          profile: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
              startup: true,
              startupUrl: true,
              lookingFor: true,
              interests: true,
              industries: true,
              bio: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Get like/match state for all attendees
  const attendeeIds = attendees
    .map((a) => a.user.profile?.id)
    .filter((id): id is string => !!id && id !== session.user!.id)

  const [myLikes, likesFromOthers] = await Promise.all([
    prisma.like.findMany({
      where: { fromUser: session.user!.id, toUser: { in: attendeeIds } },
      select: { toUser: true },
    }),
    prisma.like.findMany({
      where: { toUser: session.user!.id, fromUser: { in: attendeeIds } },
      select: { fromUser: true },
    }),
  ])

  const likedIds = new Set(myLikes.map((l) => l.toUser))
  const likedByIds = new Set(likesFromOthers.map((l) => l.fromUser))
  const matchedIds = new Set([...likedIds].filter((id) => likedByIds.has(id)))

  return {
    attendees: attendees
      .filter((a) => a.user.profile && a.userId !== session.user!.id)
      .map((a) => a.user.profile!),
    likedIds: [...likedIds],
    matchedIds: [...matchedIds],
  }
}

export async function toggleAttendance(eventId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const existing = await prisma.eventAttendee.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId: session.user.id,
      },
    },
  })

  if (existing) {
    await prisma.eventAttendee.delete({
      where: { id: existing.id },
    })
    return { attending: false }
  }

  await prisma.eventAttendee.create({
    data: {
      eventId,
      userId: session.user.id,
    },
  })

  return { attending: true }
}

export async function createEvent(data: z.input<typeof CreateEventSchema>) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const parsed = CreateEventSchema.parse(data)

  const event = await prisma.event.create({
    data: {
      ...parsed,
      community: 'emprending',
      createdBy: session.user.id,
    },
  })

  // Creator auto-attends
  await prisma.eventAttendee.create({
    data: {
      eventId: event.id,
      userId: session.user.id,
    },
  })

  return { id: event.id }
}
