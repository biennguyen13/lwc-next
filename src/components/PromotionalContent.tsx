"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PromotionalContentProps {
  onOpenRegisterModal?: () => void
}

export function PromotionalContent({ onOpenRegisterModal }: PromotionalContentProps) {
  return (
    <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Crypto Symbols */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        {/* Top Section */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/finantex-logo.png"
              alt="FinanTex Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight">
              <span className="text-orange-500">HUẤN LUYỆN THÔNG MINH.</span><br />
              <span className="text-orange-500">KỸ NĂNG PHÁT TRIỂN</span><br />
              <span className="text-white text-2xl">Nền tảng giao dịch lý tưởng để kiếm tiền</span><br />
              <span className="text-white text-2xl">FinanTex</span>
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              FinanTex là nền tảng giao dịch và kiếm thu nhập không giới hạn. 
              Với giao diện đơn giản mang đến trải nghiệm đẳng cấp thế giới cho mọi người.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Button
              onClick={onOpenRegisterModal}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              BẮT ĐẦU MIỄN PHÍ
            </Button>
          </div>
        </div>

        {/* Bottom Section - Trading Indicators */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-orange-500 font-semibold text-lg">
              CÁC CHỈ BÁO GIAO DỊCH GIÚP KHÁCH HÀNG
            </h3>
            <h4 className="text-white font-medium text-xl">
              Giao dịch thông minh
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              FinanTex phát triển các chỉ báo cực kỳ tiên tiến giúp bạn đưa ra 
              quyết định tốt hơn trong giao dịch.
            </p>
          </div>
        </div>

        {/* Device Mockups */}
        <div className="absolute bottom-0 right-0 opacity-20">
          <div className="relative">
            {/* Tablet */}
            <div className="w-32 h-24 bg-gray-700 rounded-lg shadow-lg transform rotate-12"></div>
            {/* Phone */}
            <div className="absolute -top-4 -left-8 w-8 h-16 bg-gray-600 rounded-lg shadow-lg transform -rotate-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
