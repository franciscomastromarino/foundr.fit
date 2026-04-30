import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Container maxW="md" py="20">
      <Stack gap="6" textAlign="center" align="center">
        <Heading size="3xl">Founder Radar</Heading>
        <Text fontSize="lg" color="fg.muted">
          Conecta con otros emprendedores de tu comunidad. Encontra cofounders,
          clientes, inversores y partners.
        </Text>
        <Button asChild size="lg" colorPalette="blue">
          <Link href="/login">Ingresar</Link>
        </Button>
      </Stack>
    </Container>
  )
}
