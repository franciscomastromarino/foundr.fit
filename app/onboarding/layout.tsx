import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { onboardingComplete: true, onboardingStep: true },
  })

  if (profile?.onboardingComplete) {
    redirect('/feed')
  }

  return <>{children}</>
}
