"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { HomeNavigation } from "@/components/HomeNavigation"
import { FullScreenAuthModal } from "@/components/FullScreenAuthModal"
import { HeroSection } from "@/components/HeroSection"
import { IndicatorsSection } from "@/components/IndicatorsSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CryptoBannerSection } from "@/components/CryptoBannerSection"
import { StepsSection } from "@/components/StepsSection"
import { TabletSection } from "@/components/TabletSection"
import { FAQSection } from "@/components/FAQSection"
import { FooterSection } from "@/components/FooterSection"
import { toast } from "@/hooks/use-toast"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const modal = searchParams.get('modal')
  const isLoginModalOpen = modal === 'login'
  const isRegisterModalOpen = modal === 'register'
  
  // Handle email verification results
  const verified = searchParams.get('verified')
  const message = searchParams.get('message')
  const error = searchParams.get('error')
  const verifiedEmail = searchParams.get('email')
  const openLogin = searchParams.get('openLogin')

  const handleOpenLoginModal = () => {
    router.push('/?modal=login')
  }

  const handleOpenRegisterModal = () => {
    router.push('/?modal=register')
  }

  const handleCloseLoginModal = () => {
    router.push('/')
  }

  const handleCloseRegisterModal = () => {
    router.push('/')
  }

  // Handle email verification results
  useEffect(() => {
    setTimeout(()=>{
      if (verified === 'true' && message) {
        toast({
          title: "Xác thực thành công",
          description: decodeURIComponent(message),
        })
        
        // If openLogin=true, open login modal with email
        if (openLogin === 'true' && verifiedEmail) {
          // Store email in sessionStorage for login form
          sessionStorage.setItem('prefilledEmail', decodeURIComponent(verifiedEmail))
          
          // Open login modal
          setTimeout(() => {
            router.push('/?modal=login')
          }, 500) // Wait 2 seconds for toast to show
        } else {
          // Clean URL after showing toast
          router.replace('/')
        }
      } else if (verified === 'false' && error) {
        toast({
          title: "Xác thực thất bại",
          description: decodeURIComponent(error),
          variant: "destructive",
        })
        
        // Clean URL after showing toast
        router.replace('/')
      }
    }, 1000)
  }, [verified, message, error, verifiedEmail, openLogin, router])

  return (
    <main className="min-h-screen bg-[#141416]">
      <HomeNavigation 
        onOpenLoginModal={handleOpenLoginModal}
        onOpenRegisterModal={handleOpenRegisterModal}
      />
      <HeroSection />
      <IndicatorsSection />
      <FeaturesSection />
      <CryptoBannerSection />
      <StepsSection />
      <TabletSection />
      <FAQSection />
      <FooterSection />

      {/* Auth Modals */}
      <FullScreenAuthModal 
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        defaultMode="login"
      />
      <FullScreenAuthModal 
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        defaultMode="register"
      />
    </main>
  )
}
