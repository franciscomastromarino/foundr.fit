import {
  Badge,
  Box,
  Heading,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
  Wrap,
  Button,
  Avatar,
} from '@chakra-ui/react'
import Link from 'next/link'
import type { Profile } from '@prisma/client'
import { LikeButton } from '@/components/like-button'

export function ProfileCard({ profile }: { profile: Profile }) {
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
      </HStack>
      <Wrap gap="2" mt="3">
        {profile.lookingFor.map((item) => (
          <Badge key={item} colorPalette="brand">
            Busca: {item}
          </Badge>
        ))}
        {profile.interests.map((item) => (
          <Badge key={item} colorPalette="purple" variant="outline">
            {item}
          </Badge>
        ))}
      </Wrap>
      <HStack gap="2" mt="4">
        <Button asChild variant="outline" flex="1" size="sm">
          <Link href={`/profile/${profile.id}`}>Ver perfil</Link>
        </Button>
        <LikeButton targetId={profile.id} />
      </HStack>
    </Box>
  )
}
