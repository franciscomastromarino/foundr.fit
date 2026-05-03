'use client'

import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { likeProfile } from '@/app/discover/actions'
import { trackEvent } from '@/lib/analytics'

export function LikeButton({
  targetId,
  variant = 'outline',
  size = 'sm',
}: {
  targetId: string
  variant?: 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
}) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<'liked' | 'match' | null>(null)

  const handleLike = async () => {
    if (loading || result) return
    setLoading(true)
    trackEvent('like_from_profile', { target_id: targetId })
    const res = await likeProfile(targetId)
    setResult(res.match ? 'match' : 'liked')
    setLoading(false)
  }

  if (result === 'match') {
    return (
      <Button colorPalette="green" size={size} disabled>
        Match!
      </Button>
    )
  }

  if (result === 'liked') {
    return (
      <Button variant={variant} size={size} disabled>
        Like enviado
      </Button>
    )
  }

  return (
    <Button
      colorPalette="brand"
      variant={variant}
      size={size}
      onClick={handleLike}
      loading={loading}
    >
      Me interesa
    </Button>
  )
}
