"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  Settings, 
  User, 
  Bell, 
  Download,
  Gift,
  ArrowLeftRight,
  RotateCcw
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWalletStore } from "@/stores"
import { useToast } from "@/hooks/use-toast"

export function Navigation() {
  const [notificationCount] = useState(148) // Mock notification count
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { balanceSummary, refreshBalanceSummary, bettingMode, setBettingMode, resetDemoBalance } = useWalletStore()
  const { toast } = useToast()
  
  // Get real and demo balances
  const realBalance = balanceSummary?.real?.total_available_usd || 0
  const demoBalance = balanceSummary?.demo?.total_available_usd || 0
  
  // Get current active balance
  const currentBalance = bettingMode === 'real' ? realBalance : demoBalance
  
  // Handle account change and close dropdown
  const handleAccountChange = (account: 'real' | 'demo') => {
    setBettingMode(account)
    setIsDropdownOpen(false)
  }

  // Handle reset demo balance
  const handleResetDemoBalance = async () => {
    if (isResetting) return
    
    try {
      setIsResetting(true)
      
      await resetDemoBalance({
        token_symbol: 'USDT'
      })
      
      toast({
        title: "Reset thành công",
        description: "Demo balance đã được reset về 1000 USDT",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Reset demo balance failed:", error)
      
      let errorMessage = "Có lỗi xảy ra khi reset demo balance"
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Reset thất bại",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  // Auto-refresh balance summary every 15 seconds
  useEffect(() => {
    refreshBalanceSummary()
    const interval = setInterval(() => {
      refreshBalanceSummary()
    }, 15000) // 15 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

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

          {/* Account Balance Dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white px-4 py-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-300">
                      {bettingMode === 'real' ? 'Tài khoản Thật' : 'Tài khoản Demo'}
                    </div>
                    <div className="text-sm font-semibold">
                      ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-gray-800 border-gray-700">
              {/* Real Account Section */}
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleAccountChange('real')}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      bettingMode === 'real' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 font-medium">Tài khoản thực</div>
                      <div className="text-sm  text-gray-300">
                        ${realBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Demo Account Section */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer"  onClick={() => handleAccountChange('demo')}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      bettingMode === 'demo' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300 font-medium">Tài khoản Demo</div>
                      <div className="text-sm  text-gray-300">
                        ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700 p-2 rounded-full"
                    onClick={handleResetDemoBalance}
                    disabled={isResetting}
                    title="Reset demo balance về 1000 USDT"
                  >
                    <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
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
