"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SwapContextType {
  isSwapModalOpen: boolean
  openSwapModal: () => void
  closeSwapModal: () => void
}

const SwapContext = createContext<SwapContextType | undefined>(undefined)

interface SwapProviderProps {
  children: ReactNode
}

export function SwapProvider({ children }: SwapProviderProps) {
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)

  const openSwapModal = () => {
    setIsSwapModalOpen(true)
  }

  const closeSwapModal = () => {
    setIsSwapModalOpen(false)
  }

  return (
    <SwapContext.Provider
      value={{
        isSwapModalOpen,
        openSwapModal,
        closeSwapModal,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export function useSwapModal() {
  const context = useContext(SwapContext)
  if (context === undefined) {
    throw new Error("useSwapModal must be used within a SwapProvider")
  }
  return context
}
