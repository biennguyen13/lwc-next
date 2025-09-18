"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  TradingIcon, 
  VipMemberIcon, 
  WalletIcon, 
  DashboardIcon
} from "./ui/icons"
import { Button } from "./ui/button"
import { X } from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeItem?: string
  onItemClick?: (item: string) => void
}

export function MobileSidebar({ isOpen, onClose, activeItem, onItemClick }: MobileSidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    {
      id: "trading",
      label: "Giao Dịch",
      icon: TradingIcon,
      href: "/trading",
      isActive: pathname === "/trading" || activeItem === "trading"
    },
    {
      id: "vip",
      label: "Thành Viên Vip", 
      icon: VipMemberIcon,
      href: "/vip",
      isActive: pathname === "/vip" || activeItem === "vip"
    },
    {
      id: "wallet",
      label: "Ví",
      icon: WalletIcon,
      href: "/wallet-main",
      isActive: pathname === "/wallet-main" || activeItem === "wallet"
    },
    {
      id: "dashboard",
      label: "Bảng Điều Khiển",
      icon: DashboardIcon,
      href: "/dashboard",
      isActive: pathname === "/dashboard" || activeItem === "dashboard"
    }
  ]

  const handleItemClick = (item: any) => {
    onItemClick?.(item.id)
    onClose() // Close mobile menu when item is clicked
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <img 
              src="/finantex-logo.png" 
              alt="FINANTEX" 
              className="h-12 w-auto"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-200 hover:bg-gray-700 p-2"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Deposit Button */}
          <div className="mb-8">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold">
              Nạp tiền
            </Button>
          </div>

          {/* Menu Sections */}
          <div className="space-y-6">
            {/* Earn Money Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Kiếm tiền
              </h3>
              <div className="space-y-2">
                {menuItems.slice(0, 2).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-orange-500 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <Icon 
                        isActive={item.isActive}
                        className="w-5 h-5" 
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Profile Management Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Quản Lý Hồ Sơ
              </h3>
              <div className="space-y-2">
                {menuItems.slice(2).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-orange-500 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <Icon 
                        isActive={item.isActive}
                        className="w-5 h-5" 
                      />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <h3 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Cài đặt & Trợ giúp
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Cài đặt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
