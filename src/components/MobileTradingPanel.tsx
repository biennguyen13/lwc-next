"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, X } from "lucide-react"
import { useStoreCommunication } from "@/stores/store-communication"
import { useBinance30sCandlesEvents, useBettingStore, useWalletStore } from "@/stores"
import { toast } from "@/hooks/use-toast"

interface MobileTradingPanelProps {
  currentPrice?: number
  countdownTime?: number
}

export default function MobileTradingPanel({
  currentPrice = 116360.96,
  countdownTime = 20,
}: MobileTradingPanelProps) {
  const [value, setValue] = useState<number>(20)
  const [profit, setProfit] = useState<number>(39) // 20 * 1.95 = 39
  const [profitPercentage, setProfitPercentage] = useState<number>(195)
  
  // Real-time countdown state
  const [currentCountdown, setCurrentCountdown] = useState<number>(0)
  const [isBettingTime, setIsBettingTime] = useState<boolean>(false)

  const { subscribe } = useStoreCommunication()
  const { placeOrder, placeOrderLoading } = useBettingStore()
  const { bettingMode, balanceSummary, refreshBalanceSummary } = useWalletStore()

  // Listen for candle updates
  useBinance30sCandlesEvents(({payload: candles}) => {
    if (!candles || candles.length === 0) return
    
    // Update profit based on current market conditions
    const lastCandle = candles[candles.length - 1]
    if (lastCandle) {
      const priceChange = lastCandle.close_price - lastCandle.open_price
      const volatility = Math.abs(priceChange) / lastCandle.open_price
      
      // Adjust profit based on volatility (195% = 1.95x vốn)
      const baseProfit = value * (profitPercentage / 100)
      const adjustedProfit = baseProfit * (1 + volatility * 0.5)
      setProfit(Math.round(adjustedProfit))
    }
  })

  // Listen to realtime updates for countdown
  useEffect(() => {
    const unsubscribe = subscribe('BINANCE_30S_REALTIME_UPDATED', (event) => {
      const realtimeData = event.payload
      
      if (realtimeData) {
        const currentSecond = realtimeData.second || 0
        const isBetting = realtimeData.isBet || false
        
        setIsBettingTime(isBetting)
        setCurrentCountdown(currentSecond)
      }
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [subscribe])


  const handleAmountChange = (newValue: number) => {
    // Get available balance based on current betting mode
    let availableBalance = 0
    
    if (bettingMode === 'real') {
      // Get real account USDT balance
      const usdtBalance = balanceSummary?.real?.tokens?.USDT?.available_balance
      availableBalance = usdtBalance ? parseFloat(usdtBalance) : 0
    } else {
      // Get demo account USDT balance
      const usdtBalance = balanceSummary?.demo?.tokens?.USDT?.available_balance
      availableBalance = usdtBalance ? parseFloat(usdtBalance) : 0
    }
    
    if (newValue >= 0 && newValue <= availableBalance) {
      setValue(newValue)
      // Recalculate profit (195% = 1.95x vốn)
      const newProfit = newValue * (profitPercentage / 100)
      setProfit(newProfit)
    }
  }

  const handleIncrease = async () => {
    if (!isBettingTime) {
      console.log("❌ Cannot place order - betting time is over")
      toast({
        title: "Không thể đặt lệnh",
        description: "Thời gian đặt lệnh đã kết thúc",
        variant: "destructive",
      })
      return
    }

    if (value <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền cược",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("✅ TĂNG - Buy order placed with value:", value)
      
      const result = await placeOrder({
        symbol: "BTCUSDT",
        order_type: "BUY",
        amount: value,
        mode: bettingMode
      })

      refreshBalanceSummary();

      toast({
        title: "Đặt lệnh thành công",
        description: `Lệnh BUY ${value} USDT đã được đặt thành công`,
        duration: 1000,
      })
    } catch (error) {
      console.error("Error placing BUY order:", error)
      toast({
        title: "Lỗi",
        description: "Không thể đặt lệnh BUY. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const handleDecrease = async () => {
    if (!isBettingTime) {
      console.log("❌ Cannot place order - betting time is over")
      toast({
        title: "Không thể đặt lệnh",
        description: "Thời gian đặt lệnh đã kết thúc",
        variant: "destructive",
      })
      return
    }

    if (value <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền cược",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("✅ GIẢM - Sell order placed with value:", value)
      
      const result = await placeOrder({
        symbol: "BTCUSDT",
        order_type: "SELL",
        amount: value,
        mode: bettingMode
      })

      refreshBalanceSummary();
      
      toast({
        title: "Đặt lệnh thành công",
        description: `Lệnh SELL ${value} USDT đã được đặt thành công`,
        duration: 1000,
      })
    } catch (error) {
      console.error("Error placing SELL order:", error)
      toast({
        title: "Lỗi",
        description: "Không thể đặt lệnh SELL. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const clearAmount = () => {
    setValue(0)
    setProfit(0)
  }

  return (
    <div className="bg-gray-900 border-t border-gray-700 p-1">
      {/* Profit/Loss Display */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-white text-base">Lợi nhuận</span>
        <span className="text-red-500 text-base ml-2">{profitPercentage - 100}%</span>
        <span className="text-green-500 text-base ml-1">+${profit.toFixed(2)}</span>
      </div>

      {/* Amount Input and Adjustment */}
      <div className="flex items-center justify-center mb-2 gap-2">
        {/* Decrease Button */}
        <button
          onClick={() => handleAmountChange(value - 5)}
          disabled={value <= 0}
          className="flex-1 h-10 bg-gray-700 rounded flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">-</span>
        </button>

        {/* Amount Input */}
        <div className="relative flex-2">
          <input
            type="number"
            value={value}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className="h-10 bg-gray-800 border border-gray-600 rounded text-white text-center text-sm px-2 pr-8"
            min="0"
            step="5"
            max={bettingMode === 'real' 
              ? balanceSummary?.real?.tokens?.USDT?.available_balance 
              : balanceSummary?.demo?.tokens?.USDT?.available_balance}
          />
          {value > 0 && (
            <button
              onClick={clearAmount}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Increase Button */}
        <button
          onClick={() => handleAmountChange(value + 5)}
          disabled={value >= (bettingMode === 'real' 
            ? balanceSummary?.real?.tokens?.USDT?.available_balance 
            : balanceSummary?.demo?.tokens?.USDT?.available_balance) - 4}
          className="flex-1 h-10 bg-gray-700 rounded flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Action Buttons and Timer */}
      <div className="flex items-center justify-between">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={!isBettingTime || placeOrderLoading || value <= 0}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mr-2 font-bold text-sm transition-colors ${
            isBettingTime && !placeOrderLoading && value > 0
              ? 'bg-[#fc605f] hover:bg-red-600 text-white' 
              : 'bg-gray-600 text-gray-200 cursor-not-allowed'
          }`}
        >
          <span>GIẢM</span>
          <TrendingDown className="w-4 h-4" />
        </button>

        {/* Countdown Timer */}
        <div className="bg-gray-700 h-11 text-white px-4 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs">
            {isBettingTime ? "Hãy đặt lệnh" : "Đang chờ kết quả"}
          </span>
          <span className="text-sm font-bold">{currentCountdown}s</span>
        </div>

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={!isBettingTime || placeOrderLoading || value <= 0}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ml-2 font-bold text-sm transition-colors ${
            isBettingTime && !placeOrderLoading && value > 0
              ? 'bg-[#31baa0] hover:bg-[#31baa0] text-white' 
              : 'bg-gray-600 text-gray-200 cursor-not-allowed'
          }`}
        >
          <span>TĂNG</span>
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
