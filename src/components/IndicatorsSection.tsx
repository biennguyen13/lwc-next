"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, Target } from "lucide-react"

export function IndicatorsSection() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content - Mockup Images */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Tablet & Phone Mockup */}
              <div className="relative z-10">
                <Image
                  src="/images/mockup-tablet-phone.png"
                  alt="FinanTex Trading Indicators"
                  width={600}
                  height={500}
                  className="w-full max-w-[500px] lg:max-w-[600px] h-auto"
                  priority
                />
              </div>

              {/* Background Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-full blur-3xl scale-150"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* Subtitle */}
            <div className="inline-flex items-center space-x-2 text-orange-500 font-semibold text-sm uppercase tracking-wider">
              <span>CÁC CHỈ BÁO GIAO DỊCH GIÚP KHÁCH HÀNG KIẾM ĐƯỢC NHIỀU TIỀN HƠN</span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Giao dịch thông minh với các chỉ báo tiên tiến
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              FinanTex phát triển các chỉ báo cực kỳ tiên tiến và dễ sử dụng để giúp các nhà giao dịch đưa ra quyết định tốt hơn trong giao dịch.
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
        </div>
      </div>

    </section>
  )
}
