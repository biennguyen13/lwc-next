"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GlobalLoadingContextType {
  isLoading: boolean
  loadingMessage: string
  showLoading: (message?: string) => void
  hideLoading: () => void
  setLoadingMessage: (message: string) => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined)

interface GlobalLoadingProviderProps {
  children: ReactNode
}

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Đang tải...')

  const showLoading = (message: string = 'Đang tải...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  const updateLoadingMessage = (message: string) => {
    setLoadingMessage(message)
  }

  const value: GlobalLoadingContextType = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    setLoadingMessage: updateLoadingMessage
  }

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Simple spinning circle */}
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderTopColor: 'white', borderWidth: '4px' }}></div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  )
}

export const useGlobalLoading = (): GlobalLoadingContextType => {
  const context = useContext(GlobalLoadingContext)
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider')
  }
  return context
}

