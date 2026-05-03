import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Founder Radar',
  description: 'Networking para miembros de Emprending',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Founder Radar',
  },
  openGraph: {
    title: 'Founder Radar',
    description: 'Conecta con otros emprendedores de tu comunidad',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0D1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} dark`}>
      <body suppressHydrationWarning style={{ background: '#0B0D1A', paddingBottom: '72px' }}>
        <Providers>
          {children}
          <Navbar />
        </Providers>
      </body>
    </html>
  )
}
