import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { GlobalLoadingProvider } from '@/contexts/GlobalLoadingContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LWC Next.js Demo',
  description: 'Lightweight Charts với Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
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