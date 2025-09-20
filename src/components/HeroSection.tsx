"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden">
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Subtitle */}
            <div className="inline-flex items-center space-x-2 text-orange-500 font-semibold text-sm uppercase tracking-wider">
              <span>HUẤN LUYỆN THÔNG MINH. KỸ NĂNG PHÁT TRIỂN</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Nền tảng giao dịch lý tưởng để kiếm tiền{" "}
              <span className="text-orange-500">FinanTex</span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              FinanTex là nền tảng giao dịch và kiếm thu nhập không giới hạn. 
              Với giao diện đơn giản mang đến trải nghiệm đẳng cấp thế giới cho mọi người.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                BẮT ĐẦU MIỄN PHÍ
              </Button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Mockup */}
              <div className="relative z-10">
                <Image
                  src="/images/mockup-phone-coin.png"
                  alt="FinanTex Trading App"
                  width={400}
                  height={800}
                  className="w-full max-w-[300px] lg:max-w-[400px] h-auto"
                  priority
                />
              </div>

              {/* Background Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-3xl scale-150"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
