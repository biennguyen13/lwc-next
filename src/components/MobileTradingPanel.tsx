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
  const [profit, setProfit] = useState<number>(39)
  const [profitPercentage, setProfitPercentage] = useState<number>(95)
  
  // Real-time countdown state
  const [currentCountdown, setCurrentCountdown] = useState<number>(0)
  const [isBettingTime, setIsBettingTime] = useState<boolean>(false)

  const { placeBet, subscribe } = useStoreCommunication()
  const { bettingMode } = useBettingStore()
  const { balance } = useWalletStore()

  // Listen for candle updates
  useBinance30sCandlesEvents(({payload: candles}) => {
    if (!candles || candles.length === 0) return
    
    // Update profit based on current market conditions
    const lastCandle = candles[candles.length - 1]
    if (lastCandle) {
      const priceChange = lastCandle.close_price - lastCandle.open_price
      const volatility = Math.abs(priceChange) / lastCandle.open_price
      
      // Adjust profit based on volatility
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
    if (newValue >= 1 && newValue <= balance) {
      setValue(newValue)
      // Recalculate profit
      const newProfit = newValue * (profitPercentage / 100)
      setProfit(Math.round(newProfit))
    }
  }

  const handleBet = async (direction: 'up' | 'down') => {
    if (!isBettingTime) {
      toast({
        title: "Không thể đặt lệnh",
        description: "Thời gian đặt lệnh đã kết thúc",
        variant: "destructive",
      })
      return
    }

    if (value > balance) {
      toast({
        title: "Lỗi",
        description: "Số dư không đủ",
        variant: "destructive",
      })
      return
    }

    if (value < 1) {
      toast({
        title: "Lỗi", 
        description: "Số tiền cược tối thiểu là $1",
        variant: "destructive",
      })
      return
    }

    try {
      await placeBet({
        amount: value,
        direction: direction,
        bettingMode: bettingMode,
      })

      toast({
        title: "Thành công",
        description: `Đã đặt cược ${direction === 'up' ? 'TĂNG' : 'GIẢM'} $${value}`,
      })
    } catch (error) {
      console.error("Error placing bet:", error)
      toast({
        title: "Lỗi",
        description: "Không thể đặt cược. Vui lòng thử lại.",
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
        <span className="text-white text-sm">Lợi nhuận</span>
        <span className="text-red-500 text-sm ml-2">{profitPercentage}%</span>
        <span className="text-green-500 text-sm ml-1">+${profit}</span>
      </div>

      {/* Amount Input and Adjustment */}
      <div className="flex items-center justify-center mb-2">
        {/* Decrease Button */}
        <button
          onClick={() => handleAmountChange(value - 1)}
          disabled={value <= 1}
          className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">-</span>
        </button>

        {/* Amount Input */}
        <div className="relative mx-3">
          <input
            type="number"
            value={value}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className="w-24 h-10 bg-gray-800 border border-gray-600 rounded text-white text-center text-sm px-2 pr-8"
            min="1"
            max={balance}
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
          onClick={() => handleAmountChange(value + 1)}
          disabled={value >= balance}
          className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Action Buttons and Timer */}
      <div className="flex items-center justify-between">
        {/* Decrease Button */}
        <button
          onClick={() => handleBet('down')}
          disabled={!isBettingTime || value <= 0}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mr-2 font-bold text-sm transition-colors ${
            isBettingTime && value > 0
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
          onClick={() => handleBet('up')}
          disabled={!isBettingTime || value <= 0}
          className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ml-2 font-bold text-sm transition-colors ${
            isBettingTime && value > 0
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
