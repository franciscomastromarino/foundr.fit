import {
  Avatar,
  Badge,
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
import { notFound, redirect } from 'next/navigation'
import { ConnectButton } from './connect-button'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const profile = await prisma.profile.findUnique({ where: { id } })

  if (!profile || (!profile.visible && profile.id !== session.user.id)) {
    notFound()
  }

  const isOwn = profile.id === session.user.id

  return (
    <Container maxW="sm" py="10">
      <Stack gap="6">
        <Button asChild variant="ghost" alignSelf="start" size="sm">
          <Link href="/feed">← Volver al feed</Link>
        </Button>

        <Stack align="center" gap="3">
          <Avatar.Root size="2xl">
            <Avatar.Image src={profile.avatarUrl ?? undefined} />
            <Avatar.Fallback>{profile.fullName[0]}</Avatar.Fallback>
          </Avatar.Root>
          <Heading size="lg" textAlign="center">{profile.fullName}</Heading>
          <Text color="fg.muted">
            {profile.role} en {profile.startup}
          </Text>
          {profile.startupUrl && (
            <ChakraLink href={profile.startupUrl} target="_blank" color="blue.500" fontSize="sm">
              {profile.startupUrl.replace(/^https?:\/\//, '')}
            </ChakraLink>
          )}
          {profile.city && (
            <Text fontSize="sm" color="fg.muted">{profile.city}</Text>
          )}
        </Stack>

        {profile.bio && (
          <Text textAlign="center" fontStyle="italic">
            &ldquo;{profile.bio}&rdquo;
          </Text>
        )}

        <Stack gap="3">
          <Heading size="sm">Busca</Heading>
          <Wrap gap="2">
            {profile.lookingFor.map((item) => (
              <Badge key={item} colorPalette="blue">{item}</Badge>
            ))}
          </Wrap>
        </Stack>

        <Stack gap="3">
          <Heading size="sm">Intereses</Heading>
          <Wrap gap="2">
            {profile.interests.map((item) => (
              <Badge key={item} colorPalette="purple" variant="outline">{item}</Badge>
            ))}
          </Wrap>
        </Stack>

        <Stack gap="3">
          <Heading size="sm">Industrias</Heading>
          <Wrap gap="2">
            {profile.industries.map((item) => (
              <Badge key={item} colorPalette="teal" variant="outline">{item}</Badge>
            ))}
          </Wrap>
        </Stack>

        {profile.linkedinUrl && (
          <ChakraLink href={profile.linkedinUrl} target="_blank" color="blue.500">
            Ver LinkedIn
          </ChakraLink>
        )}

        {!isOwn && <ConnectButton targetId={profile.id} />}

        {isOwn && (
          <Button asChild variant="outline">
            <Link href="/settings">Editar perfil</Link>
          </Button>
        )}
      </Stack>
    </Container>
  )
}
