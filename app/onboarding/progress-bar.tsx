'use client'

import { Box, Container, HStack, Text } from '@chakra-ui/react'

export function ProgressBar({ step }: { step: number }) {
  return (
    <Container maxW="sm" py="4">
      <HStack gap="2" mb="1">
        {[1, 2, 3].map((s) => (
          <Box
            key={s}
            flex="1"
            h="2"
            borderRadius="full"
            bg={s <= step ? 'blue.500' : 'gray.200'}
            transition="background 0.2s"
          />
        ))}
      </HStack>
      <Text fontSize="sm" color="fg.muted" textAlign="center">
        Paso {step} de 3
      </Text>
    </Container>
  )
}
