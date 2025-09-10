"use client"

import { Eye, EyeOff } from "lucide-react"

interface WalletHeaderProps {
  totalBalance: number
  isBalanceHidden: boolean
  onToggleBalance: () => void
}

export function WalletHeader({ 
  totalBalance, 
  isBalanceHidden, 
  onToggleBalance 
}: WalletHeaderProps) {
  return (
    <div className="bg-orange-500 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium">Tổng tài sản (USDT)</h1>
          <div className="text-3xl font-bold mt-2">
            {isBalanceHidden ? "****" : totalBalance.toLocaleString()}
          </div>
        </div>
        
        <button
          onClick={onToggleBalance}
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

