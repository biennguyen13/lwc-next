"use client"

import { createContext, useContext, ReactNode } from "react"
import { useWalletStore } from "@/stores"

interface ActiveOrdersContextType {
  isActiveOrdersOpen: boolean
  activeOrdersTab: "open" | "closed"
  toggleActiveOrders: () => void
  closeActiveOrders: () => void
  setActiveOrdersTab: (tab: "open" | "closed") => void
}

const ActiveOrdersContext = createContext<ActiveOrdersContextType | undefined>(undefined)

interface ActiveOrdersProviderProps {
  children: ReactNode
}

export function ActiveOrdersProvider({ children }: ActiveOrdersProviderProps) {
  const { 
    isActiveOrdersOpen, 
    activeOrdersTab, 
    setActiveOrdersOpen, 
    setActiveOrdersTab 
  } = useWalletStore()

  const toggleActiveOrders = () => {
    setActiveOrdersOpen(!isActiveOrdersOpen)
  }

  const closeActiveOrders = () => {
    setActiveOrdersOpen(false)
  }

  return (
    <ActiveOrdersContext.Provider value={{
      isActiveOrdersOpen,
      activeOrdersTab,
      toggleActiveOrders,
      closeActiveOrders,
      setActiveOrdersTab
    }}>
      {children}
    </ActiveOrdersContext.Provider>
  )
}

export function useActiveOrders() {
  const context = useContext(ActiveOrdersContext)
  if (context === undefined) {
    throw new Error('useActiveOrders must be used within an ActiveOrdersProvider')
  }
  return context
}
