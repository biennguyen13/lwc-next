"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores"
import { Navigation } from "@/components/Navigation"
import { Sidebar } from "@/components/Sidebar"
import { MobileSidebar } from "@/components/MobileSidebar"
import { UserMenu } from "@/components/UserMenu"
import { StoreEventManager } from "@/stores/store-communication-usage"
import { Toaster } from "@/components/ui"
import { ActiveOrdersProvider, useActiveOrders } from "@/contexts/ActiveOrdersContext"
import { useAuthSync } from "@/hooks/use-auth-sync"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

function ConditionalLayoutContent({ children }: ConditionalLayoutProps) {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isActiveOrdersOpen, toggleActiveOrders } = useActiveOrders()
  
  // Enable auth sync across tabs
  useAuthSync()

  useEffect(() => {
    setMounted(true)
    
    // Check auth status on app initialization (when browser reloads)
    checkAuthStatus()
  }, [checkAuthStatus])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // If user is authenticated, show full layout with navigation and sidebar
  return (
    <div className={`min-h-screen bg-gray-900 ${isAuthenticated ? 'pt-[65px]' : 'pt-0'}`}>
      {
        isAuthenticated && 
        <Navigation 
          onToggleActiveOrders={toggleActiveOrders}
          isActiveOrdersOpen={isActiveOrdersOpen}
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      }
      <StoreEventManager />
      <main className="flex overflow-x-hidden h-full">
        {
          isAuthenticated && 
          <Sidebar />
        }
        {
          isAuthenticated && 
          <MobileSidebar 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        }
        <div className={`flex-1 z-0 ${isAuthenticated ? 'pl-1 lg:pl-[95px]' : ''}`}>
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
