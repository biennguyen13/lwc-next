"use client"

export function CryptoBannerSection() {
  return (
    <section className="relative py-6 bg-[#f57c00]">
      {/* Dark line at top */}
      <div className="absolute top-0 left-0 right-0 h-1"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          
          {/* Binance Smart Chain */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className=" flex items-center justify-center">
                <img
                  src="/images/BSC.webp"
                  alt="Binance Smart Chain"
                />
              </div>
            </div>
          </div>

          {/* Bitcoin */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className=" flex items-center justify-center">
                <img
                  src="/images/BTC.webp"
                  alt="Bitcoin"
                />
              </div>
            </div>
          </div>

          {/* Tether */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className=" flex items-center justify-center">
                <img
                  src="/images/USDT.webp"
                  alt="Tether"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
