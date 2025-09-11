"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  Settings, 
  User, 
  Bell, 
  Download,
  Gift
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [notificationCount] = useState(148) // Mock notification count

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-6 h-[65px] flex items-center justify-between">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Logo */}
        <div className="flex items-center flex-1">
          <img 
            src="/finantex-logo.png" 
            alt="FINANTEX" 
            className="h-12 w-auto"
          />
        </div>

        {/* Center Items */}
        <div className="flex items-center space-x-4">
          {/* Prize Pool */}
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg border-0">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-yellow-400" />
              <div className="text-center">
                <div className="text-xs">Prize Pool</div>
                <div className="text-sm font-semibold">$26.83K</div>
              </div>
            </div>
          </Badge>

          {/* Demo Account Balance */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white px-4 py-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-300">Tài khoản Demo</div>
                    <div className="text-sm font-semibold">$3,197.97</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                Chuyển sang tài khoản thật
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-gray-700">
                Cài đặt tài khoản
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Deposit Button */}
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Nạp nhanh</span>
            </div>
          </Button>
        </div>

        {/* Right Items */}
        <div className="flex items-center space-x-6">
          {/* Settings */}
          <div className="flex flex-col items-center space-y-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-gray-700 p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <span className="text-xs text-gray-300">Cài đặt</span>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center space-y-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-gray-700 p-2"
            >
              <User className="w-5 h-5" />
            </Button>
            <span className="text-xs text-gray-300">Quản Lý Hồ Sơ</span>
          </div>

          {/* Notifications */}
          <div className="flex flex-col items-center space-y-1">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-gray-700 p-2"
              >
                <Bell className="w-5 h-5" />
              </Button>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-300">Thông báo</span>
          </div>
        </div>
      </div>
    </header>
  )
}
