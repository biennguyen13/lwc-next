"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Users, 
  Wallet, 
  LayoutDashboard,
  TrendingUp
} from "lucide-react"

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    {
      id: "trading",
      label: "Giao Dịch",
      icon: TrendingUp,
      href: "/trading",
      isActive: pathname === "/trading" || activeItem === "trading"
    },
    {
      id: "vip",
      label: "Thành Viên Vip", 
      icon: Users,
      href: "/vip",
      isActive: pathname === "/vip" || activeItem === "vip"
    },
    {
      id: "wallet",
      label: "Ví",
      icon: Wallet,
      href: "/wallet-main",
      isActive: pathname === "/wallet-main" || activeItem === "wallet"
    },
    {
      id: "dashboard",
      label: "Bảng Điều Khiển",
      icon: LayoutDashboard,
      href: "/dashboard",
      isActive: pathname === "/dashboard" || activeItem === "dashboard"
    }
  ]

  return (
    <aside className="w-[95px] bg-gray-900 border-r border-gray-700">
      <div className="">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onItemClick?.(item.id)}
                className={`w-full flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors ${
                  item.isActive
                    ? " text-orange-500"
                    : "text-gray-300 hover:text-white "
                }`}
              >
                <Icon 
                  className={`w-6 h-6 ${
                    item.isActive ? "text-orange-400" : "text-gray-400"
                  }`} 
                />
                <span className={`text-xs font-medium text-center ${
                  item.isActive ? "text-orange-400" : "text-gray-400"
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
