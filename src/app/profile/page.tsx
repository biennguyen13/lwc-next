"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { ProfileForm } from "@/components/ProfileForm"
import { Navigation } from "@/components/Navigation"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus()
      setIsCheckingAuth(false)
    }
    
    checkAuth()
  }, [checkAuthStatus])

  useEffect(() => {
    if (!isCheckingAuth && !isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, isCheckingAuth, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileForm user={user} />
        </div>
      </main>
    </div>
  )
}
