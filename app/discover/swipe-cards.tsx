'use client'

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
import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { Profile } from '@prisma/client'
import { likeProfile } from './actions'
import { trackEvent } from '@/lib/analytics'
import { ThumbsUp, X, MapPin } from 'lucide-react'

function MatchBanner({
  name,
  onContinue,
}: {
  name: string
  onContinue: () => void
}) {
  return (
    <Stack align="center" gap="5" p="8" textAlign="center">
      {/* Match illustration */}
      <Box w="120px" h="80px">
        <svg viewBox="0 0 120 80" width="120" height="80">
          <defs>
            <radialGradient id="matchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="40" r="38" fill="url(#matchGlow)" />
          <circle cx="42" cy="35" r="10" fill="#1A1D35" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx="42" cy="32" r="4" fill="#4ade80" />
          <circle cx="78" cy="35" r="10" fill="#1A1D35" stroke="#22c55e" strokeWidth="1.5" />
          <circle cx="78" cy="32" r="4" fill="#4ade80" />
          <path d="M52 40 Q60 50 68 40" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="1.5s" repeatCount="indefinite" />
          </path>
        </svg>
      </Box>

      <Stack gap="2">
        <Heading size="lg" color="green.400">Match!</Heading>
        <Text fontSize="lg">
          Vos y <Text as="span" fontWeight="bold" color="white">{name}</Text> se dieron like mutuamente.
        </Text>
        <Text color="fg.muted" fontSize="sm">
          Podés contactarlo/a desde tu lista de matches.
        </Text>
      </Stack>
      <Button onClick={onContinue} colorPalette="green" size="lg" w="full">
        Seguir descubriendo
      </Button>
    </Stack>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Stack gap="4" align="center" textAlign="center">
      <Box position="relative">
        {/* Avatar glow */}
        <Box
          position="absolute"
          inset="-8"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(67,24,255,0.2) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Avatar.Root size="2xl">
          <Avatar.Image src={profile.avatarUrl ?? undefined} />
          <Avatar.Fallback>{profile.fullName[0]}</Avatar.Fallback>
        </Avatar.Root>
      </Box>

      <Stack gap="1">
        <Heading size="lg">{profile.fullName}</Heading>
        <Text color="fg.muted">
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
          <Text fontSize="sm" color="fg.muted">
            {profile.teamSize} {profile.teamSize === 'Solo founder' ? '' : 'personas'}
          </Text>
        )}
        {profile.city && (
          <Text fontSize="sm" color="fg.muted" display="flex" alignItems="center" justifyContent="center" gap="1">
            <MapPin size={13} />
            {profile.city}
          </Text>
        )}
      </Stack>

      {profile.bio && (
        <Text fontStyle="italic" color="fg.muted">&ldquo;{profile.bio}&rdquo;</Text>
      )}

      <Wrap gap="2" justify="center">
        {profile.lookingFor.map((item) => (
          <Badge key={item} colorPalette="brand">
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

      <Button asChild variant="ghost" size="sm" color="fg.muted">
        <Link href={`/profile/${profile.id}`}>Ver perfil completo</Link>
      </Button>
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
      <Container maxW="sm" py="6">
        <Box bg="surface.card" borderRadius="2xl" borderWidth="1px" borderColor="surface.border" overflow="hidden">
          <MatchBanner name={matchInfo.name} onContinue={handleContinueAfterMatch} />
        </Box>
      </Container>
    )
  }

  if (!currentProfile) {
    return (
      <Container maxW="sm" py="10">
        <Stack align="center" gap="5" textAlign="center">
          {/* Empty state illustration */}
          <Box w="120px" h="100px">
            <svg viewBox="0 0 120 100" width="120" height="100">
              <circle cx="60" cy="50" r="40" fill="#141726" stroke="#1A1D35" strokeWidth="2" />
              <circle cx="60" cy="42" r="12" fill="none" stroke="#8B8FA3" strokeWidth="1.5" />
              <path d="M42 68 Q60 80 78 68" fill="none" stroke="#8B8FA3" strokeWidth="1.5" />
              <line x1="75" y1="25" x2="85" y2="15" stroke="#8B8FA3" strokeWidth="1.5" />
              <line x1="85" y1="25" x2="75" y2="15" stroke="#8B8FA3" strokeWidth="1.5" />
            </svg>
          </Box>
          <Heading size="lg">No hay más perfiles</Heading>
          <Text color="fg.muted">
            Ya viste a todos los miembros disponibles. Volvé más tarde.
          </Text>
        </Stack>
      </Container>
    )
  }

  return (
    <Container maxW="sm" py="4">
      <Stack gap="5">
        <Box
          bg="surface.card"
          borderWidth="1px"
          borderColor="surface.border"
          borderRadius="2xl"
          p="6"
          position="relative"
          overflow="hidden"
        >
          {/* Top gradient glow */}
          <Box
            position="absolute"
            top="-60px"
            left="50%"
            transform="translateX(-50%)"
            w="300px"
            h="200px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(67,24,255,0.15) 0%, transparent 70%)"
            pointerEvents="none"
          />
          <Box position="relative">
            <ProfileCard profile={currentProfile} />
          </Box>
        </Box>

        <HStack gap="4" justify="center">
          <Button
            size="xl"
            variant="outline"
            onClick={handlePass}
            disabled={loading}
            flex="1"
            borderRadius="xl"
          >
            <X size={20} />
            Pasar
          </Button>
          <Button
            size="xl"
            colorPalette="brand"
            onClick={handleLike}
            loading={loading}
            flex="1"
            borderRadius="xl"
          >
            <ThumbsUp size={20} />
            Me interesa
          </Button>
        </HStack>

        <Text textAlign="center" fontSize="sm" color="fg.subtle">
          {profiles.length - currentIndex - 1} perfiles restantes
        </Text>
      </Stack>
    </Container>
  )
}
