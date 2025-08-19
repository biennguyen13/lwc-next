"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useStoreCommunication } from "@/stores/store-communication"

interface TradingPanelProps {
  currentPrice?: number
  countdownTime?: number
}

export default function TradingPanel({
  currentPrice = 116360.96,
  countdownTime = 20,
}: TradingPanelProps) {
  const [value, setValue] = useState<number>(10)
  const [profit, setProfit] = useState<number>(19.5)
  const [profitPercentage, setProfitPercentage] = useState<number>(195)
  const [sentiment, setSentiment] = useState<{
    bearish: number
    bullish: number
  }>({
    bearish: 49,
    bullish: 51,
  })
  
  // Real-time countdown state
  const [currentCountdown, setCurrentCountdown] = useState<number>(0)
  const [isBettingTime, setIsBettingTime] = useState<boolean>(false)
  
  // Store communication
  const { subscribe } = useStoreCommunication()

  // Listen to realtime updates
  useEffect(() => {
    const unsubscribe = subscribe('BINANCE_30S_REALTIME_UPDATED', (event) => {
      // console.log('TradingPanel: Real-time update received:', event)
      const realtimeData = event.payload
      
      if (realtimeData) {
        const currentSecond = realtimeData.second || 0
        const isBetting = realtimeData.isBet || false
        
        setIsBettingTime(isBetting)
        
        if (isBetting) {
          setCurrentCountdown(currentSecond)
        } else {
          setCurrentCountdown(currentSecond)
        }
        
        // Update current price if available
        if (realtimeData.realtimeCandle) {
          // You can update currentPrice here if needed
          console.log('🔄 TradingPanel: Real-time price updated:', realtimeData.realtimeCandle.close_price)
        }
      }
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [subscribe])

  const quickValues = [5, 10, 20, 50, 100]

  const handleValueChange = (newValue: number) => {
    setValue(newValue)
  }

  // Calculate profit when value changes
  useEffect(() => {
    const calculatedProfit = value * (profitPercentage / 100)
    setProfit(calculatedProfit)
  }, [value, profitPercentage])

  const handleQuickValue = (quickValue: number) => {
    setValue((prev) => prev + quickValue)
  }

  const handleAll = () => {
    setValue(1000) // Set to a high value for "All"
  }

  const handleIncrease = () => {
    if (!isBettingTime) {
      console.log("❌ Cannot place order - betting time is over")
      return
    }
    console.log("✅ TĂNG - Buy order placed with value:", value)
    // Add your buy logic here
  }

  const handleDecrease = () => {
    if (!isBettingTime) {
      console.log("❌ Cannot place order - betting time is over")
      return
    }
    console.log("✅ GIẢM - Sell order placed with value:", value)
    // Add your sell logic here
  }

  return (
    <div className="rounded-lg p-2 space-y-6">
      {/* Giá trị (Value) Section */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base">Giá trị</h3>

        {/* Value Input */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleValueChange(Math.max(0, value - 5))}
            className="w-10 h-10 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded flex items-center justify-center transition-colors"
          >
            -
          </button>
          <div className="flex-1 px-1 h-10 flex items-center relative border border-border rounded bg-background">
            <span className="text-foreground text-base">${value}</span>
            <button
              onClick={() => handleValueChange(0)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-full flex items-center justify-center transition-colors text-xs"
            >
              ×
            </button>
          </div>
          <button
            onClick={() => handleValueChange(value + 5)}
            className="w-10 h-10 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>

        {/* Quick Value Buttons */}
        <div className="grid grid-cols-3 gap-1">
          {quickValues.map((quickValue) => (
            <button
              key={quickValue}
              onClick={() => handleQuickValue(quickValue)}
              className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-colors text-sm font-medium"
            >
              +{quickValue}
            </button>
          ))}
          <button
            onClick={handleAll}
            className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-colors text-sm font-medium"
          >
            All
          </button>
        </div>
      </div>

      {/* Lợi nhuận (Profit) Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 justify-center">
          <div className="text-foreground text-base">Lợi nhuận</div>
          <div className="text-cyan-500 dark:text-cyan-400">{profitPercentage}%</div>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-red-500 font-bold text-2xl">
            +${profit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Chỉ báo tâm lý (Sentiment Indicator) Section */}
      <div className="space-y-2">
        <h3 className="text-foreground text-xs text-center">Chỉ báo tâm lý</h3>

        {/* Sentiment Bar */}
        <div className="space-y-2">
          <div className="flex h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${sentiment.bearish}%` }}
            ></div>
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${sentiment.bullish}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-red-500">{sentiment.bearish}%</span>
            <span className="text-cyan-500">{sentiment.bullish}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* TĂNG Button */}
        <button
          onClick={handleIncrease}
          disabled={!isBettingTime}
          className={`w-full py-4 font-bold text-base rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isBettingTime 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          TĂNG <TrendingUp className="w-5 h-5" />
        </button>

        {/* Place Order Button */}
        <div className="w-full py-2 bg-gray-600 text-white rounded-lg">
          <div className="text-center text-sm">
            {isBettingTime ? "Hãy đặt lệnh" : "Đang chờ kết quả"}
          </div>
          <div className="text-center text-sm mt-1">{currentCountdown}s</div>
        </div>

        {/* GIẢM Button */}
        <button
          onClick={handleDecrease}
          disabled={!isBettingTime}
          className={`w-full py-4 font-bold text-base rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isBettingTime 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          GIẢM <TrendingDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
