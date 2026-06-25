import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JM LASHES | Studio de Belleza',
  description: 'Studio de Belleza – Johana Martinez. Extensiones de pestañas, Lash Lifting, Diseño de Uñas y más.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JM Studio',
  },
  other: {
    'theme-color': '#C8849A',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon.jpeg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
