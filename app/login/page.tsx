'use client'

import { signIn } from 'next-auth/react'
import {
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'

export default function LoginPage() {
  return (
    <Container maxW="sm" py="20">
      <Stack gap="8">
        <Stack gap="2" textAlign="center">
          <Heading size="2xl">Founder Radar</Heading>
          <Text color="fg.muted">Networking para miembros de Emprending</Text>
        </Stack>
        <Stack gap="3" w="full">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/feed' })}
            size="lg"
            w="full"
          >
            Continuar con Google
          </Button>
          <Button
            onClick={() => signIn('linkedin', { callbackUrl: '/feed' })}
            size="lg"
            w="full"
            variant="outline"
          >
            Continuar con LinkedIn
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
