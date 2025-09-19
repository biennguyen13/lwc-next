"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useStoreCommunication } from "@/stores/store-communication"
import { useBinance30sCandlesEvents, useBettingStore, useWalletStore } from "@/stores"
import { toast } from "@/hooks/use-toast"

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
  const [profitPercentage, setProfitPercentage] = useState<number>(95)
  const [sentiment, setSentiment] = useState<{
    bearish: number
    bullish: number
  }>({
    bearish: 50,
    bullish: 50,
  })

  // New state for sentiment data
  const [sentimentData, setSentimentData] = useState<{
    totalCandles: number
    totalTrades: number
    totalBuyTrades: number
    totalSellTrades: number
    buyPercentage: number
    sellPercentage: number
  }>({
    totalCandles: 0,
    totalTrades: 0,
    totalBuyTrades: 0,
    totalSellTrades: 0,
    buyPercentage: 50,
    sellPercentage: 50,
  })

  // Listen for candle updates and calculate base sentiment data
  useBinance30sCandlesEvents(({payload: candles}) => {
    if (!candles || candles.length === 0) return

    // Calculate sentiment based on last 20 candles
    let totalBuyTrades = 0
    let totalSellTrades = 0
    let totalTrades = 0

    candles.slice(-25).forEach((candle: any) => {
      if (candle && candle.open_price && candle.close_price && candle.number_of_trades) {
        const isBuyCandle = candle.close_price > candle.open_price
        const trades = candle.number_of_trades
        
        totalTrades += trades
        
        if (isBuyCandle) {
          totalBuyTrades += trades
        } else {
          totalSellTrades += trades
        }
      }
    })

    // Calculate percentages with 2 decimal places
    const buyPercentage = totalTrades > 0 ? parseFloat(((totalBuyTrades / totalTrades) * 100).toFixed(2)) : 50
    const sellPercentage = totalTrades > 0 ? parseFloat(((totalSellTrades / totalTrades) * 100).toFixed(2)) : 50

    console.log('📊 Base sentiment calculation:', {
      totalCandles: candles.length,
      totalTrades,
      totalBuyTrades,
      totalSellTrades,
      buyPercentage,
      sellPercentage
    })

    // Update sentiment data state
    setSentimentData({
      totalCandles: candles.length,
      totalTrades,
      totalBuyTrades,
      totalSellTrades,
      buyPercentage,
      sellPercentage,
    })
  })
  
  // Real-time countdown state
  const [currentCountdown, setCurrentCountdown] = useState<number>(0)
  const [isBettingTime, setIsBettingTime] = useState<boolean>(false)
  
  // Store communication
  const { subscribe } = useStoreCommunication()
  
  // Betting store
  const { placeOrder, placeOrderLoading } = useBettingStore()
  
  // Wallet store for betting mode
  const { bettingMode, refreshBalanceSummary, balanceSummary } = useWalletStore()

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
        
        // Update sentiment with real-time candle data
        if (realtimeData.candle) {
          const candle = realtimeData.candle
          const volume = candle.trades || 0
          const isBuyCandle = candle.close > candle.open
          
          // console.log('🔄 Real-time candle update:', {
          //   open: candle.open,
          //   close: candle.close,
          //   volume,
          //   isBuyCandle
          // })
          
          // Update sentiment data with real-time volume
          setSentimentData(prevData => {
            let newTotalBuyTrades = prevData.totalBuyTrades
            let newTotalSellTrades = prevData.totalSellTrades
            let newTotalTrades = prevData.totalTrades + volume
            
            if (isBuyCandle) {
              newTotalBuyTrades += volume
            } else {
              newTotalSellTrades += volume
            }
            
            // Calculate new percentages
            const newBuyPercentage = newTotalTrades > 0 ? parseFloat(((newTotalBuyTrades / newTotalTrades) * 100).toFixed(2)) : 50
            const newSellPercentage = newTotalTrades > 0 ? parseFloat(((newTotalSellTrades / newTotalTrades) * 100).toFixed(2)) : 50
            
            // console.log('📊 Updated sentiment with real-time data:', JSON.stringify({
            //   newTotalTrades,
            //   newTotalBuyTrades,
            //   newTotalSellTrades,
            //   newBuyPercentage,
            //   newSellPercentage
            // }, null, 2))
            
            // Update sentiment display
            setSentiment({
              bearish: newSellPercentage,
              bullish: newBuyPercentage,
            })
            
            return {
              ...prevData,
              totalTrades: newTotalTrades,
              totalBuyTrades: newTotalBuyTrades,
              totalSellTrades: newTotalSellTrades,
              buyPercentage: newBuyPercentage,
              sellPercentage: newSellPercentage,
            }
          })
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
    const calculatedProfit = value * ((100 + profitPercentage) / 100)
    setProfit(calculatedProfit)
  }, [value, profitPercentage])

  const handleQuickValue = (quickValue: number) => {
    setValue((prev) => prev + quickValue)
  }

  const handleAll = () => {
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
    
    // Set value to available balance, but ensure it's at least 1
    const finalValue = Math.max(availableBalance, 1)
    setValue(finalValue)
    
    // Show toast notification
    toast({
      title: "Đã chọn tất cả",
      description: `Sử dụng ${finalValue.toFixed(2)} USDT từ tài khoản ${bettingMode === 'real' ? 'thực' : 'demo'}`,
      variant: "default",
    })
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

    try {
      console.log("✅ TĂNG - Buy order placed with value:", value)
      
      const result = await placeOrder({
        symbol: "BTCUSDT",
        order_type: "BUY",
        amount: value,
        mode: bettingMode
      })

      toast({
        title: "Đặt lệnh thành công",
        description: `Lệnh BUY ${value} USDT đã được đặt thành công`,
        duration: 1000,
      })

      // Refresh wallet balance summary after successful order
      await refreshBalanceSummary()

      console.log("Order placed successfully:", result)
    } catch (error) {
      console.error("Failed to place BUY order:", error)
      toast({
        title: "Đặt lệnh thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt lệnh",
        variant: "destructive",
        duration: 1000,
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

    try {
      console.log("✅ GIẢM - Sell order placed with value:", value)
      
      const result = await placeOrder({
        symbol: "BTCUSDT",
        order_type: "SELL",
        amount: value,
        mode: bettingMode
      })

      toast({
        title: "Đặt lệnh thành công",
        description: `Lệnh SELL ${value} USDT đã được đặt thành công`,
        duration: 1000,
      })

      // Refresh wallet balance summary after successful order
      await refreshBalanceSummary()

      console.log("Order placed successfully:", result)
    } catch (error) {
      console.error("Failed to place SELL order:", error)
      toast({
        title: "Đặt lệnh thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt lệnh",
        variant: "destructive",
        duration: 1000,
      })
    }
  }

  return (
    <div className="rounded-lg p-1 lg:p-2 space-y-6">
      {/* Giá trị (Value) Section */}
      <div className="space-y-3">
        <h3 className="text-foreground text-base">Giá trị</h3>

        {/* Value Input */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleValueChange(Math.max(0, value - 5))}
            className="w-6 lg:w-10 h-10 bg-gray-700 hover:bg-gray-600 text-secondary-foreground rounded flex items-center justify-center transition-colors"
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
            className="w-6 lg:w-10 h-10 bg-gray-700 hover:bg-gray-600 text-secondary-foreground rounded flex items-center justify-center transition-colors"
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
              className="p-x1 lg:px-3 py-1 lg:py-2 bg-gray-700 hover:bg-gray-600 text-secondary-foreground rounded-xl transition-colors text-sm font-medium"
            >
              +{quickValue}
            </button>
          ))}
          <button
            onClick={handleAll}
            className="p-x1 lg:px-3 py-1 lg:py-2 bg-gray-700 hover:bg-gray-600 text-secondary-foreground rounded-xl transition-colors text-sm font-medium"
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
              className="bg-[#fc605f] h-full transition-all duration-300"
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
          disabled={!isBettingTime || placeOrderLoading}
          className={`w-full py-4 font-bold text-base rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isBettingTime && !placeOrderLoading
              ? 'bg-[#31baa0] hover:bg-[#31baa0] text-white' 
              : 'bg-gray-600 text-gray-200 cursor-not-allowed'
          }`}
        >
          TĂNG <TrendingUp className="w-5 h-5" />
        </button>

        {/* Place Order Button */}
        <div className="w-full py-2 bg-gray-700 text-gray-200 rounded-lg">
          <div className="text-center text-sm">
            {isBettingTime ? "Hãy đặt lệnh" : "Đang chờ kết quả"}
          </div>
          <div className="text-center text-sm mt-1">{currentCountdown}s</div>
        </div>

        {/* GIẢM Button */}
        <button
          onClick={handleDecrease}
          disabled={!isBettingTime || placeOrderLoading}
          className={`w-full py-4 font-bold text-base rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isBettingTime && !placeOrderLoading
              ? 'bg-[#fc605f] hover:bg-red-600 text-white' 
              : 'bg-gray-600 text-gray-200 cursor-not-allowed'
          }`}
        >
          GIẢM <TrendingDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
