'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react'
import Link from 'next/link'
import { LikeButton } from '@/components/like-button'

type AttendeeProfile = {
  id: string
  fullName: string
  avatarUrl: string | null
  role: string
  startup: string
  startupUrl: string | null
  lookingFor: string[]
  interests: string[]
  industries: string[]
  bio: string | null
  city: string | null
}

export function AttendeeList({
  attendees,
  likedIds,
  matchedIds,
  eventId,
}: {
  attendees: AttendeeProfile[]
  likedIds: string[]
  matchedIds: string[]
  eventId: string
}) {
  if (attendees.length === 0) {
    return (
      <Box
        bg="surface.elevated"
        borderRadius="xl"
        p="8"
        textAlign="center"
      >
        <Text color="fg.muted" fontSize="sm">
          Todavía no hay otros asistentes confirmados. Compartí el evento para que se sumen.
        </Text>
      </Box>
    )
  }

  return (
    <Stack gap="0">
      {attendees.map((profile) => (
        <AttendeeCard
          key={profile.id}
          profile={profile}
          liked={likedIds.includes(profile.id)}
          matched={matchedIds.includes(profile.id)}
        />
      ))}
    </Stack>
  )
}

function AttendeeCard({
  profile,
  liked,
  matched,
}: {
  profile: AttendeeProfile
  liked: boolean
  matched: boolean
}) {
  return (
    <Box
      bg="white"
      borderBottomWidth="1px"
      borderColor="surface.border"
      py="4"
      px="1"
    >
      <HStack gap="3" align="start">
        {/* Avatar */}
        <Box flexShrink={0}>
          <Box
            borderRadius="full"
            p="0.5"
            borderWidth="2px"
            borderColor={matched ? 'green.400' : 'surface.border'}
          >
            <Avatar.Root size="lg">
              <Avatar.Image src={profile.avatarUrl || undefined} borderRadius="full" />
              <Avatar.Fallback>{profile.fullName[0]}</Avatar.Fallback>
            </Avatar.Root>
          </Box>
        </Box>

        {/* Content */}
        <Stack gap="1" flex="1" minW="0">
          <Stack gap="0">
            <HStack gap="2">
              <Heading size="sm" lineHeight="1.3">{profile.fullName}</Heading>
              {matched && (
                <Badge
                  fontSize="2xs"
                  px="2"
                  py="0.5"
                  borderRadius="full"
                  colorPalette="green"
                >
                  Match
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.3">
              {profile.role} en{' '}
              <Text as="span" fontWeight="500">{profile.startup}</Text>
            </Text>
            {profile.city && (
              <Text fontSize="xs" color="fg.subtle">{profile.city}</Text>
            )}
          </Stack>

          {/* Shared industries highlight */}
          <Wrap gap="1.5" mt="0.5">
            {profile.lookingFor.slice(0, 2).map((item) => (
              <Badge
                key={`lf-${item}`}
                fontSize="2xs"
                px="2"
                py="0.5"
                borderRadius="full"
                bg="brand.50"
                color="brand.600"
                fontWeight="500"
              >
                {item}
              </Badge>
            ))}
            {profile.industries.slice(0, 2).map((item) => (
              <Badge
                key={`ind-${item}`}
                fontSize="2xs"
                px="2"
                py="0.5"
                borderRadius="full"
                bg="accent.50"
                color="accent.700"
                fontWeight="500"
              >
                {item}
              </Badge>
            ))}
          </Wrap>

          {/* Actions */}
          <HStack gap="2" mt="2">
            <Box flex="1" />
            <Button asChild variant="ghost" size="xs" color="brand.500" fontWeight="500" px="2">
              <Link href={`/profile/${profile.id}`}>Ver perfil</Link>
            </Button>
            <LikeButton targetId={profile.id} initialLiked={liked} initialMatch={matched} />
          </HStack>
        </Stack>
      </HStack>
    </Box>
  )
}
