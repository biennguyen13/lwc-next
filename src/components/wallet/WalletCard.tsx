"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { USDTIcon } from "@/components/ui/usdt-icon"
import { useWalletStore } from "@/stores"

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
  const { isBalanceHidden } = useWalletStore()
  return (
    <div className=" max-w-[650px] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
            {isBalanceHidden ? "****" : `${balance.toLocaleString()} ${currency}`}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {isBalanceHidden ? "****" : `~$${usdValue.toLocaleString()}`}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={onDeposit}
          className="flex-1 flex items-center justify-center space-x-2  hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors border "
        >
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <ArrowDown className="w-5 h-5 text-green-400 relative -bottom-1.5 right-2" />
          </div>
          <span>Nạp tiền</span>
        </button>
        
        <button
          onClick={onWithdraw}
          className="flex-1 flex items-center justify-center space-x-2  hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors border "
        >
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <ArrowUp className="w-5 h-5 text-red-400 relative bottom-1.5 right-2" />
          </div>
          <span>Rút tiền</span>
        </button>
      </div>
    </div>
  )
}

