"use client"

import { Button } from "@/components/ui/button"

export function TabletSection() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 "></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          
          {/* Tablet Mockup */}
          <div className="mb-12">
            <img
              src="/images/tablet.png"
              alt="FinanTex Trading Platform"
              className="w-full max-w-[600px] h-auto"
            />
          </div>

          {/* Content Below */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Heading */}
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500">
                Mọi nơi bạn muốn.
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500">
                Mọi lúc bạn cần.
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              FinanTex có thể giúp ngay cả những nhà giao dịch mới cũng có thể kiếm được thu nhập bền vững.
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
