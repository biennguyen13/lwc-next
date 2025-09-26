"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ArrowLeftRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useWalletStore } from "@/stores"

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [direction, setDirection] = useState<'from-wallet' | 'to-wallet'>('from-wallet')
  const [isSwapped, setIsSwapped] = useState(false)

  const { balanceSummary, swapBalance } = useWalletStore()

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount("")
      setDirection('from-wallet')
      setIsSwapped(false)
    }
  }, [isOpen])

  // Get current balances
  const getCurrentBalances = () => {
    if (!balanceSummary) return { tradingBalance: 0, walletBalance: 0 }
    
    const usdtToken = balanceSummary.real?.tokens?.USDT
    if (!usdtToken) return { tradingBalance: 0, walletBalance: 0 }
    
    return {
      tradingBalance: parseFloat(usdtToken.available_balance) || 0,
      walletBalance: parseFloat(usdtToken.usdt_wallet) || 0
    }
  }

  const { tradingBalance, walletBalance } = getCurrentBalances()

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    setAmount(numericValue)
  }

  const handleMaxAmount = () => {
    if (direction === 'from-wallet') {
      setAmount(walletBalance.toString())
    } else {
      setAmount(tradingBalance.toString())
    }
  }

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ",
        variant: "destructive"
      })
      return
    }

    const amountNum = parseFloat(amount)
    const maxAmount = direction === 'from-wallet' ? walletBalance : tradingBalance

    if (amountNum > maxAmount) {
      toast({
        title: "Lỗi",
        description: `Số tiền không được vượt quá ${maxAmount.toLocaleString()}`,
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      await swapBalance({
        token_symbol: "USDT",
        amount: amount,
        direction: direction
      })

      const actionText = direction === 'from-wallet' ? 'từ wallet sang trading' : 'từ trading về wallet'
      
      toast({
        title: "Thành công",
        description: `Đã chuyển ${amount} USDT ${actionText}`,
        variant: "success"
      })

      onClose()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Chuyển tiền thất bại",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectionToggle = () => {
    setDirection(prev => prev === 'from-wallet' ? 'to-wallet' : 'from-wallet')
    setIsSwapped(prev => !prev)
    setAmount("")
  }

  if (!isOpen) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-white"></h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-8 h-8 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="pb-6 px-6 space-y-6">
            {/* Account Balances */}
            <div className="flex items-center justify-between">
              {/* Left Account - Wallet or Trading based on isSwapped */}
              <div className="flex-1 text-center">
                <div className={`text-sm mb-1 ${isSwapped ? 'text-gray-400' : 'text-blue-400'}`}>
                  {isSwapped ? 'Tài khoản thực' : 'USDT WALLET'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {isSwapped ? tradingBalance.toLocaleString() : walletBalance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">USDT</div>
              </div>

              {/* Swap Direction Button */}
              <button
                onClick={handleDirectionToggle}
                className="mx-4 p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ArrowLeftRight className="w-6 h-6 text-gray-300" />
              </button>

              {/* Right Account - Trading or Wallet based on isSwapped */}
              <div className="flex-1 text-center">
                <div className={`text-sm mb-1 ${isSwapped ? 'text-blue-400' : 'text-gray-400'}`}>
                  {isSwapped ? 'USDT WALLET' : 'Tài khoản thực'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {isSwapped ? walletBalance.toLocaleString() : tradingBalance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">USDT</div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white text-sm font-medium">Số tiền</label>
                <button
                  onClick={handleMaxAmount}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Tất cả
                </button>
              </div>
              <Input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                className="bg-white text-gray-900 text-lg font-medium h-12 rounded-lg border-0"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSwap}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang xử lý..." : "Chuyển tiền"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
