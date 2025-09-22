import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { GlobalLoadingProvider } from '@/contexts/GlobalLoadingContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BITCRYPTEX',
  description: 'BITCRYPTEX',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '40x40', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GlobalLoadingProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </GlobalLoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 