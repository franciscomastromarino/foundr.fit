import {
  Badge,
  Card,
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

export function ProfileCard({ profile }: { profile: Profile }) {
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
        </HStack>
        <Wrap gap="2" mt="3">
          {profile.lookingFor.map((item) => (
            <Badge key={item} colorPalette="blue">
              Busca: {item}
            </Badge>
          ))}
          {profile.interests.map((item) => (
            <Badge key={item} colorPalette="purple" variant="outline">
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
