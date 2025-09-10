"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI } from "@/lib/api"
import { storeCommunication } from "./store-communication"

// Types
interface User {
  id: number
  email: string
  full_name: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
  twoFactorToken?: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
  refreshTokenExpiresAt: string
}

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  checkAuthStatus: () => Promise<void>
  clearError: () => void
  clearAll: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authAPI.login(credentials)
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })

          // Emit login success event
          storeCommunication.emitUserLoggedIn(response.user)
          
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || "Đăng nhập thất bại"
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "auth-store")
          
          throw error
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true })
        
        try {
          await authAPI.logout()
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

          // Emit logout event
          storeCommunication.emitUserLoggedOut()
          
        } catch (error: any) {
          // Even if logout fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
          
          // Emit logout event anyway
          storeCommunication.emitUserLoggedOut()
        }
      },

      // Refresh token action
      refreshToken: async () => {
        try {
          const response = await authAPI.refreshToken()
          
          set({
            user: response.user,
            isAuthenticated: true,
            error: null
          })
          
        } catch (error: any) {
          // If refresh fails, logout user
          get().logout()
        }
      },

      // Check auth status
      checkAuthStatus: async () => {
        set({ isLoading: true })
        
        try {
          const hasToken = await authAPI.hasAccessToken()
          
          if (hasToken) {
            // Try to refresh token to get user info
            await get().refreshToken()
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
          
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },

      // Clear all state
      clearAll: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
