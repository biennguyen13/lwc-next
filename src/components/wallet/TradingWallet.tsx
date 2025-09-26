"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, RotateCcw } from "lucide-react"
import { useWalletStore } from "@/stores"
import { useSwapModal } from "@/hooks/use-swap-modal"
import { useToast } from "@/hooks/use-toast"

export function TradingWallet() {
  const { balanceSummary, resetDemoBalance } = useWalletStore()
  const { openSwapModal } = useSwapModal()
  const { toast } = useToast()
  const [isResetting, setIsResetting] = useState(false)

  // Get balances
  const realBalance = balanceSummary?.real?.tokens?.USDT?.total_balance 
    ? parseFloat(balanceSummary.real.tokens.USDT.total_balance) 
    : 0
  
  const demoBalance = balanceSummary?.demo?.tokens?.USDT?.total_balance 
    ? parseFloat(balanceSummary.demo.tokens.USDT.total_balance) 
    : 0

  const handleResetDemo = async () => {
    setIsResetting(true)
    try {
      await resetDemoBalance({ token_symbol: 'USDT' })
      toast({
        title: "Thành công",
        description: "Đã reset tài khoản demo về 1,000 USDT",
        variant: "success"
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Reset demo thất bại",
        variant: "destructive"
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Real Account Card */}
      <Card className="border-gray-700 overflow-hidden relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/livebanner.bc9b94b.41690ad9.png')"
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 "></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="space-y-4 text-center">
            {/* Header */}
            <div className="text-gray-300 text-sm font-medium">
              Tài khoản thực
            </div>
            
            {/* Balance */}
            <div className="text-3xl font-bold text-white">
              {realBalance.toLocaleString('en-US', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 2 
              })}
            </div>
            
            {/* Action Button */}
            <Button 
              onClick={openSwapModal}
              className="w-[80%] mx-auto bg-[#ea9002] hover:bg-orange-600 text-white font-medium py-6 px-6 rounded-lg flex items-center justify-center gap-2 text-base"
            >
              <ArrowLeftRight className="w-5 h-5" />
              Chuyển tiền
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Account Card */}
      <Card className="border-gray-700 overflow-hidden relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/winbanner.0ab8f9f.bd028c28.png')"
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 "></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="space-y-4 text-center">
            {/* Header */}
            <div className="text-gray-300 text-sm font-medium">
              Tài khoản Demo
            </div>
            
            {/* Balance */}
            <div className="text-3xl font-bold text-white">
              {demoBalance.toLocaleString('en-US', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 2 
              })}
            </div>
            
            {/* Action Button */}
            <Button 
              onClick={handleResetDemo}
              disabled={isResetting}
              className="w-[80%] mx-auto bg-[#ea9002] hover:bg-orange-600 text-white font-medium py-6 px-6 rounded-lg flex items-center justify-center gap-2 text-base disabled:opacity-50"
            >
              <RotateCcw className={`w-5 h-5 ${isResetting ? 'animate-spin' : ''}`} />
              {isResetting ? 'Đang reset...' : 'Nạp lại'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
