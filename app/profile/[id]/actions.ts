'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { buildWhatsAppLink, buildIntroMessage } from '@/lib/whatsapp'

export async function connectWithProfile(targetId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.id === targetId) throw new Error('Cannot connect to self')

  const [target, current] = await Promise.all([
    prisma.profile.findUnique({ where: { id: targetId } }),
    prisma.profile.findUnique({ where: { id: session.user.id } }),
  ])

  if (!target || !current) throw new Error('Profile not found')

  await prisma.connection.upsert({
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

  const message = buildIntroMessage(target, current)
  return buildWhatsAppLink(target.whatsappE164, message)
}
