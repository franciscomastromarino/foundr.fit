import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile } from '@prisma/client'

function MatchCard({ profile }: { profile: Profile }) {
  return (
    <Card.Root>
      <Card.Body>
        <HStack gap="3" align="start">
          <Avatar.Root>
            <Avatar.Image src={profile.avatarUrl ?? undefined} />
            <Avatar.Fallback>{profile.fullName[0]}</Avatar.Fallback>
          </Avatar.Root>
          <Stack gap="0" flex="1">
            <Heading size="sm">{profile.fullName}</Heading>
            <Text fontSize="sm" color="fg.muted">
              {profile.role} en{' '}
              {profile.startupUrl ? (
                <ChakraLink href={profile.startupUrl} target="_blank" color="blue.500">
                  {profile.startup}
                </ChakraLink>
              ) : (
                profile.startup
              )}
            </Text>
            {profile.teamSize && (
              <Text fontSize="xs" color="fg.muted">
                {profile.teamSize} {profile.teamSize === 'Solo founder' ? '' : 'personas'}
              </Text>
            )}
          </Stack>
          <Badge colorPalette="green">Match</Badge>
        </HStack>
        <Wrap gap="2" mt="3">
          {profile.lookingFor.map((item) => (
            <Badge key={item} colorPalette="blue" variant="outline">
              {item}
            </Badge>
          ))}
        </Wrap>
      </Card.Body>
      <Card.Footer>
        <Button asChild variant="outline" w="full">
          <Link href={`/profile/${profile.id}`}>Ver perfil</Link>
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}

export default async function MatchesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // Find mutual likes
  const myLikes = await prisma.like.findMany({
    where: { fromUser: session.user.id },
    select: { toUser: true },
  })
  const likedIds = myLikes.map((l) => l.toUser)

  let matchedProfiles: Profile[] = []

  if (likedIds.length > 0) {
    const mutualLikes = await prisma.like.findMany({
      where: {
        fromUser: { in: likedIds },
        toUser: session.user.id,
      },
      select: { fromUser: true },
    })
    const matchedIds = mutualLikes.map((l) => l.fromUser)

    if (matchedIds.length > 0) {
      matchedProfiles = await prisma.profile.findMany({
        where: { id: { in: matchedIds } },
        orderBy: { updatedAt: 'desc' },
      })
    }
  }

  return (
    <Container maxW="lg" py="6">
      <Heading size="xl" mb="6">
        Matches ({matchedProfiles.length})
      </Heading>

      {matchedProfiles.length === 0 ? (
        <Stack align="center" gap="4" py="10" textAlign="center">
          <Text color="fg.muted" fontSize="lg">
            Todavía no tenés matches.
          </Text>
          <Text color="fg.muted">
            Explorá perfiles en Descubrir y dale like a los que te interesen.
          </Text>
          <Button asChild colorPalette="blue">
            <Link href="/discover">Ir a Descubrir</Link>
          </Button>
        </Stack>
      ) : (
        <Stack gap="4">
          {matchedProfiles.map((profile) => (
            <MatchCard key={profile.id} profile={profile} />
          ))}
        </Stack>
      )}
    </Container>
  )
}
