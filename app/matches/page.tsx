import {
  Avatar,
  Badge,
  Box,
  Button,
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
import { Compass } from 'lucide-react'

function EmptyMatchesSvg() {
  return (
    <Box w="180px" h="150px" mx="auto">
      <svg viewBox="0 0 180 150" width="180" height="150">
        <defs>
          <radialGradient id="emptyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4318FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4318FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="90" cy="75" r="65" fill="url(#emptyGlow)" />
        {/* Person left */}
        <g transform="translate(50, 45)">
          <circle cx="0" cy="0" r="16" fill="#141726" stroke="#4318FF" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="0" cy="-4" r="6" fill="#674BFF" />
          <path d="M-8 8 Q0 16 8 8" fill="none" stroke="#674BFF" strokeWidth="1.5" />
        </g>
        {/* Person right */}
        <g transform="translate(130, 45)">
          <circle cx="0" cy="0" r="16" fill="#141726" stroke="#4318FF" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="0" cy="-4" r="6" fill="#8D78FF" />
          <path d="M-8 8 Q0 16 8 8" fill="none" stroke="#8D78FF" strokeWidth="1.5" />
        </g>
        {/* Dashed connection line */}
        <line x1="66" y1="45" x2="114" y2="45" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5 4" />
        {/* Question mark */}
        <text x="90" y="50" textAnchor="middle" fill="#4318FF" fontSize="14" fontWeight="bold" opacity="0.5">?</text>
        {/* Hearts floating */}
        <g opacity="0.4">
          <path d="M85 95 L90 102 L95 95 Q95 90 90 90 Q85 90 85 95Z" fill="#674BFF">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M70 110 L73 115 L76 110 Q76 107 73 107 Q70 107 70 110Z" fill="#8D78FF" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
          </path>
          <path d="M105 108 L108 113 L111 108 Q111 105 108 105 Q105 105 105 108Z" fill="#B3A5FF" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    </Box>
  )
}

function MatchCard({ profile }: { profile: Profile }) {
  return (
    <Box
      bg="surface.card"
      borderWidth="1px"
      borderColor="surface.border"
      borderRadius="xl"
      p="4"
    >
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
              <ChakraLink href={profile.startupUrl} target="_blank" color="brand.400">
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
        <Badge colorPalette="green" variant="solid">Match</Badge>
      </HStack>
      <Wrap gap="2" mt="3">
        {profile.lookingFor.map((item) => (
          <Badge key={item} colorPalette="brand" variant="outline">
            {item}
          </Badge>
        ))}
      </Wrap>
      <Button asChild variant="outline" w="full" mt="3" size="sm">
        <Link href={`/profile/${profile.id}`}>Ver perfil</Link>
      </Button>
    </Box>
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
        <Stack align="center" gap="4" py="8" textAlign="center">
          <EmptyMatchesSvg />
          <Heading size="md" color="fg.muted">
            Todavía no tenés matches.
          </Heading>
          <Text color="fg.subtle" maxW="xs">
            Explorá perfiles en Descubrir y dale like a los que te interesen. Cuando el interés sea mutuo, aparecerán acá.
          </Text>
          <Button asChild colorPalette="brand" size="lg" mt="2">
            <Link href="/discover">
              <Compass size={18} />
              Ir a Descubrir
            </Link>
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
