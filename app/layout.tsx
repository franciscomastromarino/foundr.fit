import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Founder Radar',
  description: 'Networking para miembros de Emprending',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Founder Radar',
  },
  openGraph: {
    title: 'Founder Radar',
    description: 'Conecta con otros emprendedores de tu comunidad',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0066ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
