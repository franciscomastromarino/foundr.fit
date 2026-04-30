'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import type { Profile } from '@prisma/client'
import { likeProfile } from './actions'
import { trackEvent } from '@/lib/analytics'

function MatchBanner({
  name,
  onContinue,
}: {
  name: string
  onContinue: () => void
}) {
  return (
    <Stack
      align="center"
      gap="4"
      p="8"
      bg="green.50"
      borderRadius="xl"
      borderWidth="2px"
      borderColor="green.300"
      textAlign="center"
    >
      <Heading size="lg" color="green.600">
        Match!
      </Heading>
      <Text fontSize="lg">
        Vos y <strong>{name}</strong> se dieron like mutuamente.
      </Text>
      <Text color="fg.muted" fontSize="sm">
        Podés contactarlo/a desde tu lista de matches.
      </Text>
      <Button onClick={onContinue} colorPalette="green">
        Seguir descubriendo
      </Button>
    </Stack>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Stack gap="4" align="center" textAlign="center">
      <Avatar.Root size="2xl">
        <Avatar.Image src={profile.avatarUrl ?? undefined} />
        <Avatar.Fallback>{profile.fullName[0]}</Avatar.Fallback>
      </Avatar.Root>

      <Stack gap="1">
        <Heading size="lg">{profile.fullName}</Heading>
        <Text color="fg.muted">
          {profile.role} en {profile.startup}
        </Text>
        {profile.city && (
          <Text fontSize="sm" color="fg.muted">
            {profile.city}
          </Text>
        )}
      </Stack>

      {profile.bio && (
        <Text fontStyle="italic">&ldquo;{profile.bio}&rdquo;</Text>
      )}

      <Wrap gap="2" justify="center">
        {profile.lookingFor.map((item) => (
          <Badge key={item} colorPalette="blue">
            Busca: {item}
          </Badge>
        ))}
      </Wrap>

      <Wrap gap="2" justify="center">
        {profile.interests.map((item) => (
          <Badge key={item} colorPalette="purple" variant="outline">
            {item}
          </Badge>
        ))}
      </Wrap>

      <Wrap gap="2" justify="center">
        {profile.industries.map((item) => (
          <Badge key={item} colorPalette="teal" variant="outline">
            {item}
          </Badge>
        ))}
      </Wrap>
    </Stack>
  )
}

export function SwipeCards({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [matchInfo, setMatchInfo] = useState<{ name: string } | null>(null)

  const currentProfile = profiles[currentIndex]

  const handleLike = useCallback(async () => {
    if (!currentProfile || loading) return
    setLoading(true)
    trackEvent('swipe_like', { target_id: currentProfile.id })

    const result = await likeProfile(currentProfile.id)

    if (result.match) {
      trackEvent('match_created', { target_id: currentProfile.id })
      setMatchInfo({ name: result.matchedName ?? currentProfile.fullName })
    } else {
      setCurrentIndex((i) => i + 1)
    }

    setLoading(false)
  }, [currentProfile, loading])

  const handlePass = useCallback(() => {
    if (!currentProfile || loading) return
    trackEvent('swipe_pass', { target_id: currentProfile.id })
    setCurrentIndex((i) => i + 1)
  }, [currentProfile, loading])

  const handleContinueAfterMatch = useCallback(() => {
    setMatchInfo(null)
    setCurrentIndex((i) => i + 1)
  }, [])

  if (matchInfo) {
    return (
      <Container maxW="sm" py="10">
        <MatchBanner name={matchInfo.name} onContinue={handleContinueAfterMatch} />
      </Container>
    )
  }

  if (!currentProfile) {
    return (
      <Container maxW="sm" py="10">
        <Stack align="center" gap="4" textAlign="center">
          <Heading size="lg">No hay más perfiles</Heading>
          <Text color="fg.muted">
            Ya viste a todos los miembros disponibles. Volvé más tarde.
          </Text>
        </Stack>
      </Container>
    )
  }

  return (
    <Container maxW="sm" py="6">
      <Stack gap="6">
        <Box
          borderWidth="1px"
          borderRadius="xl"
          p="6"
          shadow="md"
          bg="white"
          _dark={{ bg: 'gray.800' }}
        >
          <ProfileCard profile={currentProfile} />
        </Box>

        <HStack gap="4" justify="center">
          <Button
            size="xl"
            variant="outline"
            colorPalette="gray"
            onClick={handlePass}
            disabled={loading}
            flex="1"
          >
            Pasar
          </Button>
          <Button
            size="xl"
            colorPalette="green"
            onClick={handleLike}
            loading={loading}
            flex="1"
          >
            Me interesa
          </Button>
        </HStack>

        <Text textAlign="center" fontSize="sm" color="fg.muted">
          {profiles.length - currentIndex - 1} perfiles restantes
        </Text>
      </Stack>
    </Container>
  )
}
