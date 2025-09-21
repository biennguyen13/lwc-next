"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HomeNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#191B20]' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/finantex-logo.png"
                alt="FinanTex Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/register">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black transition-colors"
              >
                ĐĂNG KÝ
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                ĐĂNG NHẬP
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
