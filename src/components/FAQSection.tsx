"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index)
  }

  const faqData = [
    {
      question: "FinanTex là gì?",
      answer: "FinanTex là sàn giao dịch tùy chọn (BO) ra mắt năm 2025 với đội ngũ điều hành giàu kinh nghiệm, được thừa hưởng những công nghệ và ưu điểm của những sàn sẵn có trên thị trường cũng như cập nhật những công nghệ và tính năng mới giúp cho hệ thống giao dịch hoạt động một cách trơn chu nhất."
    },
    {
      question: "FinanTex có lừa đảo không?",
      answer: "Không vì các nhà giao dịch có thể thua lỗ do phương pháp giao dịch chưa hợp lý. FinanTex không lừa đảo để chiếm đoạt tiền của khách hàng. Nhưng đi cùng mức lợi nhuận cao đó là rủi ro của việc đầu tư cũng khá lớn. Bạn cần phải chuẩn bị tâm lý thật vững vàng và tìm hiểu để có được thu nhập tốt khi tham gia đầu tư vào dự án."
    },
    {
      question: "Tài khoản vip của FinanTex dùng để làm gì?",
      answer: "Tài khoản VIP là loại tài khoản để tham gia các chương trình Affiliate của sàn để hưởng hoa hồng giới thiệu với phí đăng ký là 100 USDT."
    },
    {
      question: "Tài khoản demo dùng để làm gì?",
      answer: "Tài khoản demo tại FinanTex là một tài khoản có 1000$ miễn phí để mọi người thử giao dịch, nâng cao kinh nghiệm cũng như tìm ra các phương pháp giao dịch tối ưu. Số tiền trong tài khoản này không giới hạn và không rút được."
    },
    {
      question: "Có mấy cách kiếm tiền trên FinanTex?",
      answer: "Không những hỗ trợ giao dịch và kiếm tiền từ sự lên xuống của thị trường, FinanTex còn giúp các nhà đầu tư kiếm thêm hoa hồng bằng cách giới thiệu những nhà đầu tư khác tham gia vào hệ thống Affiliate của sàn."
    }
  ]

  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4">
            FAQS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Câu hỏi thường gặp
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-0">
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-gray-600 last:border-b-0">
                <div 
                  className="bg-gray-800/50 p-6 cursor-pointer hover:bg-gray-800/70 transition-colors duration-200"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold pr-4">
                      {item.question}
                    </h4>
                    <ChevronDown 
                      className={`w-5 h-5 text-orange-500 transition-transform duration-200 flex-shrink-0 ${
                        openItem === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  {/* Answer */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openItem === index 
                      ? 'max-h-96 opacity-100 mt-4' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-gray-600">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
