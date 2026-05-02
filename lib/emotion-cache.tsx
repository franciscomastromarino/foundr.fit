'use client'

import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'css' })
    c.compat = true
    return c
  })

  useServerInsertedHTML(() => {
    const entries = (cache as unknown as { inserted: Record<string, string | boolean> }).inserted
    if (!entries) return null

    const names = Object.keys(entries)
    if (names.length === 0) return null

    let styles = ''
    const dataEmotionAttribute = cache.key

    for (const name of names) {
      if (entries[name] !== true) {
        styles += entries[name]
      }
    }

    return (
      <style
        key={dataEmotionAttribute}
        data-emotion={`${dataEmotionAttribute} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
