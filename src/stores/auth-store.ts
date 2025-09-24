"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI, accountAPI } from "@/lib/api"
import { storeCommunication } from "./store-communication"
import { clearAllStores } from "./store-utils"
import { triggerAuthSync } from "@/lib/simple-tab-sync"
import { User, LoginCredentials, AuthResponse } from "@/types"

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
  fetchProfile: () => Promise<void>
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

          // Fetch fresh profile data after login
          try {
            await get().fetchProfile()
          } catch (profileError) {
            console.warn('Failed to fetch profile after login:', profileError)
            // Don't throw error, user is still logged in
          }

          // Emit login success event
          storeCommunication.emitUserLoggedIn(response.user)
          
          // Trigger auth sync for other tabs
          triggerAuthSync('login')
          
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
          
          // Clear all stores first
          clearAllStores()
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })

          // Emit logout event
          storeCommunication.emitUserLoggedOut()
          
          // Trigger auth sync for other tabs
          triggerAuthSync('logout')
          
        } catch (error: any) {
          // Even if logout fails, clear all stores and local state
          clearAllStores()
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
          
          // Emit logout event anyway
          storeCommunication.emitUserLoggedOut()
          
          // Trigger auth sync for other tabs
          triggerAuthSync('logout')
        }
      },

      // Refresh token action
      refreshToken: async () => {
        console.log('refreshTokenrefreshToken')
        try {
          const response = await authAPI.refreshToken()
          
          set({
            user: response.user,
            isAuthenticated: true,
            error: null
          })

          // Fetch fresh profile data after token refresh
          try {
            await get().fetchProfile()
          } catch (profileError) {
            console.warn('Failed to fetch profile after token refresh:', profileError)
            // Don't throw error, user is still authenticated
          }
          
        } catch (error: any) {
          // If refresh fails, logout user
          get().logout()
        } finally {
          set({ isLoading: false })
        }
      },

      // Check auth status
      checkAuthStatus: async () => {
        set({ isLoading: true })
        
        try {
          const hasToken = await authAPI.hasAccessToken()
          console.log('hasToken', hasToken)
          if (hasToken) {
            // Try to refresh token to get user info
            // await get().refreshToken()
            await get().fetchProfile()
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
        } finally {
          set({ isLoading: false })
        }
      },

      // Fetch user profile
      fetchProfile: async () => {
        try {
          const profile = await accountAPI.getProfile()
          
          set((state) => ({
            user: profile,
            isAuthenticated: true,
            error: null
          }))

          // Emit profile updated event
          storeCommunication.emitUserLoggedIn(profile)
          
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || "Lấy profile thất bại"
          set({ error: errorMessage })
          
          // Emit error event
          storeCommunication.emitError(errorMessage, "auth-store")
          
          throw error
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
