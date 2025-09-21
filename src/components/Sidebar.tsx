"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  TradingIcon, 
  VipMemberIcon, 
  WalletIcon, 
  DashboardIcon 
} from "./ui/icons"
import { useAuthStore } from "@/stores"
import { LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, isLoading } = useAuthStore()
  
  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Lỗi đăng xuất",
        description: "Có lỗi xảy ra khi đăng xuất",
        variant: "destructive",
      })
    }
  }
  
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

  return (
    <aside className="hidden lg:flex w-[95px] pt-[65px] h-screen z-10 fixed left-0 top-0 bg-gray-900 border-r border-gray-700 flex-shrink-0 flex-col">
      <div className="flex-1">
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
                  isActive={item.isActive}
                  className="w-6 h-6" 
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
      
      {/* Logout Button at Bottom */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs font-medium text-center text-gray-400">
            {isLoading ? "Đang đăng xuất..." : "Đăng Xuất"}
          </span>
        </button>
      </div>
    </aside>
  )
}
