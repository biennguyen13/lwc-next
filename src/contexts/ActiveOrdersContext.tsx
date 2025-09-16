"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ActiveOrdersContextType {
  isActiveOrdersOpen: boolean
  toggleActiveOrders: () => void
  closeActiveOrders: () => void
}

const ActiveOrdersContext = createContext<ActiveOrdersContextType | undefined>(undefined)

interface ActiveOrdersProviderProps {
  children: ReactNode
}

export function ActiveOrdersProvider({ children }: ActiveOrdersProviderProps) {
  const [isActiveOrdersOpen, setIsActiveOrdersOpen] = useState(false)

  const toggleActiveOrders = () => {
    setIsActiveOrdersOpen(prev => !prev)
  }

  const closeActiveOrders = () => {
    setIsActiveOrdersOpen(false)
  }

  return (
    <ActiveOrdersContext.Provider value={{
      isActiveOrdersOpen,
      toggleActiveOrders,
      closeActiveOrders
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
