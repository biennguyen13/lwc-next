"use client"

import { useSearchParams, useRouter } from "next/navigation"
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

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const modal = searchParams.get('modal')
  const isLoginModalOpen = modal === 'login'
  const isRegisterModalOpen = modal === 'register'

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
