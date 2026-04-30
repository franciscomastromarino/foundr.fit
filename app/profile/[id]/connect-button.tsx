'use client'

import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { connectWithProfile } from './actions'

export function ConnectButton({ targetId }: { targetId: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const link = await connectWithProfile(targetId)
      window.open(link, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      colorPalette="green"
      size="lg"
      w="full"
      onClick={handleClick}
      loading={loading}
    >
      Conectar por WhatsApp
    </Button>
  )
}
