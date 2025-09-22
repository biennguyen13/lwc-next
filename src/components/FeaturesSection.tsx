"use client"

import Image from "next/image"

export function FeaturesSection() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Background Logo */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 opacity-50">
        <Image
          src="/images/favicon.e6dc0118.png"
          alt="FinanTex Logo"
          width={400}
          height={400}
          className="w-96 h-96 blur-sm"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4">
            BITCRYPTEX
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Nền tảng FinanTex được xây dựng
          </h2>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500">
            Trên sự đột phá
          </div>
        </div>

        {/* Three Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Feature 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/icons-1.svg"
                alt="Stability & Security"
                width={60}
                height={60}
                className="w-15 h-15"
              />
            </div>
            <h3 className="text-xl font-bold mb-4">
              FinanTex Ổn định & Bảo mật
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Nền tảng của chúng tôi rất ổn định và có sẵn trên toàn thế giới. 
              Chúng tôi bảo vệ tài sản của bạn bằng các phương pháp bảo mật tốt nhất.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/icons-2.svg"
                alt="Referral & Earning"
                width={60}
                height={60}
                className="w-15 h-15"
              />
            </div>
            <h3 className="text-xl font-bold mb-4">
              Giới thiệu & Kiếm tiền
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Giới thiệu bạn bè và cùng nhau kiếm tiền bằng cách giao dịch trên.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/icons-3.svg"
                alt="Fast & Free"
                width={60}
                height={60}
                className="w-15 h-15"
              />
            </div>
            <h3 className="text-xl font-bold mb-4">
              Nhanh chóng & Miễn phí
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Không có phí gửi tiền và phí rút tiền nhỏ. 
              Giao dịch được thực hiện trong vòng vài phút.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
