"use client"

import { HeroSection } from "@/components/HeroSection"
import { IndicatorsSection } from "@/components/IndicatorsSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CryptoBannerSection } from "@/components/CryptoBannerSection"
import { StepsSection } from "@/components/StepsSection"
import { TabletSection } from "@/components/TabletSection"
import { FAQSection } from "@/components/FAQSection"
import { FooterSection } from "@/components/FooterSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#141416]">
      <HeroSection />
      <IndicatorsSection />
      <FeaturesSection />
      <CryptoBannerSection />
      <StepsSection />
      <TabletSection />
      <FAQSection />
      <FooterSection />
    </main>
  )
}
