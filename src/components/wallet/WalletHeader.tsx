"use client"

import { Eye, EyeOff } from "lucide-react"
import { useWalletStore } from "@/stores"

interface WalletHeaderProps {
  totalBalance: number
  className?: string
}

export function WalletHeader({ 
  totalBalance, 
  ...props
}: WalletHeaderProps) {
  const { isBalanceHidden, setBalanceHidden } = useWalletStore()

  const handleToggleBalance = () => {
    setBalanceHidden(!isBalanceHidden)
  }
  return (
    <div className="text-white p-6" {...props}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-base md:text-lg font-medium">Tổng tài sản (USDT)</h1>
          <div className="text-xl md:text-3xl font-bold mt-2">
            {isBalanceHidden ? "****" : totalBalance.toLocaleString()}
          </div>
        </div>
        
        <button
          onClick={handleToggleBalance}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
        >
          {isBalanceHidden ? (
            <>
              <Eye className="w-5 h-5" />
              <span>Hiện số dư</span>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5" />
              <span>Ẩn số dư</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

