"use client"

export function StepsSection() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 "></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Bắt đầu với{" "}
            <span className="text-orange-500">FinanTex</span> chỉ sau 5 phút
          </h2>
        </div>

        {/* Three Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="flex justify-center mb-6">
              <img
                src="/images/icons-4.svg"
                alt="Đăng ký FinanTex"
                className="w-20 h-20"
              />
            </div>
            <div className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2">
              BƯỚC 1
            </div>
            <h3 className="text-xl font-bold mb-4">
              Đăng ký FinanTex
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Sử dụng địa chỉ email của bạn và tạo một tài khoản FinanTex miễn phí.
            </p>
            
            {/* Dotted line to next step */}
            <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 border-t-2 border-dotted border-gray-600 transform translate-x-1/2"></div>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="flex justify-center mb-6">
              <img
                src="/images/icons-5.svg"
                alt="Ký quỹ"
                className="w-20 h-20"
              />
            </div>
            <div className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2">
              BƯỚC 2
            </div>
            <h3 className="text-xl font-bold mb-4">
              Ký quỹ
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Nạp bằng nhiều loại tiền điện tử phổ biến.
            </p>
            
            {/* Dotted line to next step */}
            <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 border-t-2 border-dotted border-gray-600 transform translate-x-1/2"></div>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/images/icons-6.svg"
                alt="Bắt đầu giao dịch"
                className="w-20 h-20"
              />
            </div>
            <div className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2">
              BƯỚC 3
            </div>
            <h3 className="text-xl font-bold mb-4">
              Bắt đầu giao dịch
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Kiếm tiền từ việc dự đoán giá của tài sản.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
