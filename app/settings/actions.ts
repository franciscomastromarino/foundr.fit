'use server'

import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ROLES, INDUSTRIES, INTENTS, INTERESTS, TEAM_SIZES } from '@/lib/constants'

const ProfileSchema = z.object({
  fullName: z.string().min(2).max(80),
  whatsappE164: z.string().refine(isValidPhoneNumber, 'Número inválido'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  role: z.enum(ROLES as unknown as [string, ...string[]]),
  startup: z.string().min(1).max(80),
  startupUrl: z.string().url().optional().or(z.literal('')),
  teamSize: z.enum(TEAM_SIZES as unknown as [string, ...string[]]).optional().or(z.literal('')),
  industries: z.array(z.string()).min(1).max(3),
  lookingFor: z.array(z.string()).min(1).max(2),
  interests: z.array(z.string()).min(1).max(3),
  bio: z.string().max(280).optional().or(z.literal('')),
  city: z.string().max(80).optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  visible: z.boolean(),
})

export async function updateProfile(input: z.infer<typeof ProfileSchema>) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const data = ProfileSchema.parse(input)

  await prisma.profile.update({
    where: { id: session.user.id },
    data: {
      ...data,
      avatarUrl: data.avatarUrl || null,
      startupUrl: data.startupUrl || null,
      teamSize: data.teamSize || null,
      bio: data.bio || null,
      city: data.city || null,
      linkedinUrl: data.linkedinUrl || null,
    },
  })

  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await prisma.user.delete({ where: { id: session.user.id } })
  redirect('/')
}

export async function getMyProfile() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return prisma.profile.findUnique({ where: { id: session.user.id } })
}
