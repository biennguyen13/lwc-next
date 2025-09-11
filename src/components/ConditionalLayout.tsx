"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores"
import { Navigation } from "@/components/Navigation"
import { Sidebar } from "@/components/Sidebar"
import { UserMenu } from "@/components/UserMenu"
import { StoreEventManager } from "@/stores/store-communication-usage"
import { Toaster } from "@/components/ui"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // If user is not authenticated, show children without navigation/sidebar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900">
        <StoreEventManager />
        <main>
          {children}
        </main>
        <Toaster />
      </div>
    )
  }

  // If user is authenticated, show full layout with navigation and sidebar
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Sidebar />
      {/* <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <UserMenu />
      </div> */}
      <StoreEventManager />
      <main className="pt-[65px] pl-[105px]">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
