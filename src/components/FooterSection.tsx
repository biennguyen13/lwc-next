"use client"

import { ChevronDown } from "lucide-react"

export function FooterSection() {
  return (
    <footer className=" text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src="/images/finantex-logo.0e4abd02.png"
              alt="FinanTex Logo"
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Support Section */}
            <div>
              <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Nghĩa vụ thành viên VIP
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-white font-semibold mb-4">Bảo mật</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Điều khoản và Điều kiện
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cảnh báo rủi ro
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Miễn trừ trách nhiệm
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm leading-relaxed">
            Cảnh báo rủi ro: Giao dịch và đầu tư vào các tùy chọn kỹ thuật số có
            mức độ rủi ro đáng kể và không phù hợp với / hoặc thích hợp cho tất
            cả khách hàng. Vui lòng đảm bảo rằng bạn cần nhắc cân thận các mục
            tiêu đầu tư, mức độ kinh nghiệm và khẩu vị rủi ro trước khi mua hoặc
            bán bất kỳ tài sản kỹ thuật số nào. Bạn nên nhận thức và hiểu đầy đủ
            tất cả các rủi ro liên quan đến giao dịch và đầu tư vào tài sản kỹ
            thuật số, bạn không nên đầu tư các khoản tiền mà bạn không thể để
            mất. Bạn được cấp các quyền hạn chế không độc quyền để sử dụng tài
            sản trí tuệ có trong trang web này cho mục đích sử dụng cá nhân, phi
            thương mại, không thể chuyển nhượng liên quan đến các dịch vụ được
            cung cấp trên trang web.
          </p>
        </div>
      </div>
    </footer>
  )
}
