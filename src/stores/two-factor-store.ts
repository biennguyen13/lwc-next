"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { twoFactorAPI } from "@/lib/api/two-factor.api"
import { storeCommunication } from "./store-communication"
import { TwoFactorSetupData } from "@/types"

interface TwoFactorState {
  // State
  isEnabled: boolean
  isLoading: boolean
  error: string | null
  setupData: TwoFactorSetupData | null
  
  // Actions
  getStatus: () => Promise<void>
  getSetupData: () => Promise<void>
  reset2FA: () => Promise<void>
  setup2FA: (secret: string, token: string, password: string, email_otp: string) => Promise<void>
  disable2FA: (token: string, password: string, email_otp: string) => Promise<void>
  verify2FA: (token: string) => Promise<void>
          sendVerificationEmail: (type: 'turn-on' | 'turn-off') => Promise<void>
  clearError: () => void
  clearSetupData: () => void
}

export const useTwoFactorStore = create<TwoFactorState>()(
  persist(
    (set, get) => ({
      // Initial state
      isEnabled: false,
      isLoading: false,
      error: null,
      setupData: null,

      // Get 2FA status
      getStatus: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const status = await twoFactorAPI.getStatus()
          
          set({
            isEnabled: status.enabled,
            isLoading: false,
            error: null
          })

          // Emit status updated event
          storeCommunication.emit2FAStatusUpdated(status.enabled)
          
        } catch (error: any) {
          const errorMessage = error?.message || "Lấy trạng thái 2FA thất bại"
          set({
            isEnabled: false,
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Get setup data
      getSetupData: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const setupData = await twoFactorAPI.getSetupData()
          
          set({
            setupData,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          const errorMessage = error?.message || "Lấy dữ liệu setup 2FA thất bại"
          set({
            setupData: null,
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Reset 2FA
      reset2FA: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const setupData = await twoFactorAPI.reset2FA()
          
          set({
            setupData,
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          const errorMessage = error?.message || "Reset 2FA thất bại"
          set({
            setupData: null,
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Setup 2FA
      setup2FA: async (secret: string, token: string, password: string, email_otp: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await twoFactorAPI.setup2FA({ secret, token, password, email_otp })
          
          set({
            isEnabled: true,
            setupData: null,
            isLoading: false,
            error: null
          })

          // Emit 2FA enabled event
          storeCommunication.emit2FAStatusUpdated(true)
          
        } catch (error: any) {
          const errorMessage = error?.message || "Setup 2FA thất bại"
          set({
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Disable 2FA
      disable2FA: async (token: string, password: string, email_otp: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await twoFactorAPI.disable2FA({ token, password, email_otp })
          
          set({
            isEnabled: false,
            setupData: null,
            isLoading: false,
            error: null
          })

          // Emit 2FA disabled event
          storeCommunication.emit2FAStatusUpdated(false)
          
        } catch (error: any) {
          const errorMessage = error?.message || "Disable 2FA thất bại"
          set({
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Verify 2FA token
      verify2FA: async (token: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await twoFactorAPI.verify2FA({ token })
          
          set({
            isLoading: false,
            error: null
          })
          
        } catch (error: any) {
          const errorMessage = error?.message || "Verify 2FA thất bại"
          set({
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "two-factor-store")
          
          throw error
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },

              // Send verification email
              sendVerificationEmail: async (type: 'turn-on' | 'turn-off') => {
                set({ isLoading: true, error: null })
                
                try {
                  await twoFactorAPI.sendVerificationEmail(type)
                  
                  set({
                    isLoading: false,
                    error: null
                  })
                  
                } catch (error: any) {
                  const errorMessage = error?.message || "Gửi email verification thất bại"
                  set({
                    isLoading: false,
                    error: errorMessage
                  })
                  
                  // Emit error event
                  storeCommunication.emitError(errorMessage, "two-factor-store")
                  
                  throw error
                }
              },

      // Clear setup data
      clearSetupData: () => {
        set({ setupData: null })
      }
    }),
    {
      name: "two-factor-storage",
      partialize: (state) => ({
        isEnabled: state.isEnabled
      })
    }
  )
)
