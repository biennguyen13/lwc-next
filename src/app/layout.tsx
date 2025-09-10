import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'
import { StoreEventManager } from '@/stores/store-communication-usage'
import { Toaster } from '@/components/ui'
import { UserMenu } from '@/components/UserMenu'

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
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
            <UserMenu />
            <ThemeToggle />
          </div>
          <StoreEventManager />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 