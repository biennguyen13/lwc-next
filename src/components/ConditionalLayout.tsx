"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores"
import { Navigation } from "@/components/Navigation"
import { Sidebar } from "@/components/Sidebar"
import { UserMenu } from "@/components/UserMenu"
import { StoreEventManager } from "@/stores/store-communication-usage"
import { Toaster } from "@/components/ui"
import { ActiveOrdersProvider, useActiveOrders } from "@/contexts/ActiveOrdersContext"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

function ConditionalLayoutContent({ children }: ConditionalLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const { isActiveOrdersOpen, toggleActiveOrders } = useActiveOrders()

  useEffect(() => {
    setMounted(true)
  }, [])

  // If user is authenticated, show full layout with navigation and sidebar
  return (
    <div className="min-h-screen bg-gray-900  pt-[65px]">
      {
        isAuthenticated && 
        <Navigation 
          onToggleActiveOrders={toggleActiveOrders}
          isActiveOrdersOpen={isActiveOrdersOpen}
        />
      }
      <StoreEventManager />
      <main className="flex">
        {
          isAuthenticated && 
          <Sidebar />
        }
        <div className="flex-1">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  return (
    <ActiveOrdersProvider>
      <ConditionalLayoutContent>
        {children}
      </ConditionalLayoutContent>
    </ActiveOrdersProvider>
  )
}
