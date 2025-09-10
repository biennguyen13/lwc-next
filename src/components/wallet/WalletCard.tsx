"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { USDTIcon } from "@/components/ui/usdt-icon"

interface WalletCardProps {
  currency: string
  currencyName: string
  balance: number
  usdValue: number
  onDeposit: () => void
  onWithdraw: () => void
}

export function WalletCard({ 
  currency, 
  currencyName, 
  balance, 
  usdValue, 
  onDeposit, 
  onWithdraw 
}: WalletCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* Currency Info */}
        <div className="flex items-center space-x-4">
          <USDTIcon size={48} />
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currency}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {currencyName}
            </p>
          </div>
        </div>

        {/* Balance Info */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {balance.toLocaleString()} {currency}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            ~${usdValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={onDeposit}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
          <span>Nạp tiền</span>
        </button>
        
        <button
          onClick={onWithdraw}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
        >
          <ArrowDown className="w-5 h-5" />
          <span>Rút tiền</span>
        </button>
      </div>
    </div>
  )
}

