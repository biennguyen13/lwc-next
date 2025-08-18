"use client"

import React from "react"
import { useBinance30sStore, useBinance30sCandlesEvents, useBinance30sStatsEvents, useBinance30sLatestEvents } from "@/stores"

export const Binance30sTest: React.FC = () => {
  const { fetchCandles, fetchStats, fetchLatestCandles } = useBinance30sStore()

  // Listen to events
  useBinance30sCandlesEvents((candles) => {
    console.log("🎯 EVENT TRIGGERED: Binance 30s candles updated:", candles)
  })

  useBinance30sStatsEvents((stats) => {
    console.log("🎯 EVENT TRIGGERED: Binance 30s stats updated:", stats)
  })

  useBinance30sLatestEvents((latestCandles) => {
    console.log("🎯 EVENT TRIGGERED: Binance 30s latest candles updated:", latestCandles)
  })

  const handleTestCandles = () => {
    console.log("🔄 Fetching candles...")
    fetchCandles({ symbol: "BTCUSDT", limit: 10000 })
  }

  const handleTestStats = () => {
    console.log("🔄 Fetching stats...")
    fetchStats("BTCUSDT")
  }

  const handleTestLatest = () => {
    console.log("🔄 Fetching latest candles...")
    fetchLatestCandles({ symbol: "BTCUSDT", count: 3 })
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Binance 30s Event Test</h2>
      <p className="text-sm text-gray-600">Mở Console để xem events</p>
      
      <div className="space-x-2">
        <button
          onClick={handleTestCandles}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Fetch Candles
        </button>
        
        <button
          onClick={handleTestStats}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Fetch Stats
        </button>
        
        <button
          onClick={handleTestLatest}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Test Fetch Latest
        </button>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>✅ Click buttons để test events</p>
        <p>✅ Mở Console (F12) để xem logs</p>
        <p>✅ Events sẽ trigger khi fetch thành công</p>
      </div>
    </div>
  )
} 