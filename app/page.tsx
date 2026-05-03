import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { UserPlus, Search, MessageCircle } from 'lucide-react'

const STEPS = [
  {
    number: '1',
    title: 'Creá tu perfil',
    description: 'Completá tu perfil en 90 segundos: rol, startup, qué buscás y qué te interesa.',
    Icon: UserPlus,
  },
  {
    number: '2',
    title: 'Explorá miembros',
    description: 'Filtrá por industria, rol o intención. Encontrá a quien necesitás.',
    Icon: Search,
  },
  {
    number: '3',
    title: 'Conectá directo',
    description: 'Un click te abre WhatsApp con un mensaje pre-armado. Sin intermediarios.',
    Icon: MessageCircle,
  },
]

function RadarSvg() {
  return (
    <Box w="140px" h="140px" mx="auto" mb="-4">
      <svg viewBox="0 0 200 200" width="140" height="140">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4318FF" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#4318FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#4318FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#glow)" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#4318FF" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="100" cy="100" r="30" fill="none" stroke="#4318FF" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="100" cy="100" r="6" fill="#4318FF" />
        <circle cx="70" cy="65" r="4" fill="#8D78FF" />
        <circle cx="135" cy="80" r="3.5" fill="#B3A5FF" />
        <circle cx="85" cy="130" r="3" fill="#674BFF" />
        <circle cx="130" cy="120" r="4" fill="#8D78FF" />
        <circle cx="60" cy="100" r="2.5" fill="#B3A5FF" />
        <line x1="100" y1="100" x2="70" y2="65" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="135" y2="80" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="85" y2="130" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="0.5" />
        <line x1="100" y1="100" x2="130" y2="120" stroke="#4318FF" strokeOpacity="0.3" strokeWidth="0.5" />
      </svg>
    </Box>
  )
}

function StepCard({
  number,
  title,
  description,
  Icon,
}: {
  number: string
  title: string
  description: string
  Icon: React.ComponentType<{ size: number; color: string }>
}) {
  return (
    <Stack
      gap="3"
      align="center"
      textAlign="center"
      p="6"
      bg="surface.card"
      borderWidth="1px"
      borderColor="surface.border"
      borderRadius="xl"
    >
      <Box
        w="12"
        h="12"
        borderRadius="xl"
        bg="brand.500"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={22} color="white" />
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
    <Box position="relative" overflow="hidden">
      {/* Background gradient glow */}
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(67,24,255,0.15) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="lg" py="16" position="relative">
        <Stack gap="14" align="center">
          <Stack gap="5" textAlign="center" align="center" maxW="md">
            <RadarSvg />
            <Heading size="4xl" lineHeight="1.1">
              Founder Radar
            </Heading>
            <Text fontSize="lg" color="fg.muted" lineHeight="1.6">
              Conecta con otros emprendedores de tu comunidad. Encontra
              cofounders, clientes, inversores y partners en segundos.
            </Text>
            <Button asChild size="xl" colorPalette="brand" px="10">
              <Link href="/login">Ingresar</Link>
            </Button>
          </Stack>

          <Stack gap="6" w="full">
            <Heading size="lg" textAlign="center">
              Cómo funciona
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
              {STEPS.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </SimpleGrid>
          </Stack>

          <Text fontSize="sm" color="fg.subtle">
            Exclusivo para miembros de Emprending
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}
