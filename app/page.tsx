import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <Stack gap="2" align="center" textAlign="center" p="6">
      <Box
        w="10"
        h="10"
        borderRadius="full"
        bg="blue.500"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize="lg"
      >
        {number}
      </Box>
      <Heading size="sm">{title}</Heading>
      <Text fontSize="sm" color="fg.muted">
        {description}
      </Text>
    </Stack>
  )
}

export default function HomePage() {
  return (
    <Container maxW="lg" py="20">
      <Stack gap="16" align="center">
        <Stack gap="6" textAlign="center" align="center" maxW="md">
          <Heading size="4xl" lineHeight="1.1">
            Founder Radar
          </Heading>
          <Text fontSize="xl" color="fg.muted">
            Conecta con otros emprendedores de tu comunidad. Encontra
            cofounders, clientes, inversores y partners en segundos.
          </Text>
          <Button asChild size="xl" colorPalette="blue">
            <Link href="/login">Ingresar</Link>
          </Button>
        </Stack>

        <Stack gap="6" w="full">
          <Heading size="lg" textAlign="center">
            Cómo funciona
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
            <StepCard
              number="1"
              title="Creá tu perfil"
              description="Completá tu perfil en 90 segundos: rol, startup, qué buscás y qué te interesa."
            />
            <StepCard
              number="2"
              title="Explorá miembros"
              description="Filtrá por industria, rol o intención. Encontrá a quien necesitás."
            />
            <StepCard
              number="3"
              title="Conectá directo"
              description="Un click te abre WhatsApp con un mensaje pre-armado. Sin intermediarios."
            />
          </SimpleGrid>
        </Stack>

        <Text fontSize="sm" color="fg.muted">
          Exclusivo para miembros de Emprending
        </Text>
      </Stack>
    </Container>
  )
}
