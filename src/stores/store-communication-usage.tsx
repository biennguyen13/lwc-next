"use client"

import React from "react"
import {
  useErrorEvents,
  useStoreCommunication,
  useBinance30sCandlesEvents,
  useBinance30sStatsEvents,
  useBinance30sLatestEvents,
  useBinance30sRealtimeEvents,
} from "./index"
import { useBinance30sStore } from "./binance-30s-store"
import { useWalletStore, useBettingStore } from "./index"

// Component lắng nghe Binance 30s candles events
export const Binance30sCandlesListener: React.FC = () => {
  useBinance30sCandlesEvents((candles) => {
    console.log("Binance 30s candles updated:", candles)
    // Có thể trigger refresh chart hoặc update UI
  })

  return null
}

// Component lắng nghe Binance 30s stats events
export const Binance30sStatsListener: React.FC = () => {
  useBinance30sStatsEvents((stats) => {
    console.log("Binance 30s stats updated:", stats)
    // Có thể update dashboard hoặc notifications
  })

  return null
}

// Component lắng nghe Binance 30s latest candles events
export const Binance30sLatestListener: React.FC = () => {
  useBinance30sLatestEvents((latestCandles) => {
    console.log("Binance 30s latest candles updated:", latestCandles)
    // Có thể update real-time chart
  })

  return null
}

// Component lắng nghe Binance 30s realtime events và refresh các API
export const Binance30sRealtimeListener: React.FC = () => {
  const { refreshBalanceSummary, bettingMode } = useWalletStore()
  const { fetchActiveOrders, fetchBettingHistory } = useBettingStore()

  useBinance30sRealtimeEvents((realtimeData) => {
    if (realtimeData?.payload?.second === 28 && realtimeData?.payload?.isBet) {
      console.log("Binance 30s realtime update - refreshing APIs:", bettingMode, realtimeData)
      
      // Refresh balance summary
      refreshBalanceSummary()
      
      // Refresh active orders
      fetchActiveOrders({ mode: bettingMode })
      
      // Refresh betting history
      fetchBettingHistory({ page: 1, limit: 50, mode: bettingMode })
    }
  })

  return null
}

// Component lắng nghe error events
export const ErrorListener: React.FC = () => {
  useErrorEvents((error) => {
    console.error("Store error:", error)
    // Có thể hiển thị notification hoặc log error
  })

  return null
}

// Component gửi events
// export const EventSender: React.FC = () => {
//   const { 
//     emitError,
//     emitBinance30sCandlesUpdated,
//     emitBinance30sStatsUpdated,
//     emitBinance30sLatestUpdated,
//   } = useStoreCommunication()

//   const handleEmitBinance30sCandles = () => {
//     emitBinance30sCandlesUpdated([
//       {
//         key: "2025-01-03-15-30-0",
//         symbol: "BTCUSDT",
//         interval: "30s",
//         open_time: 1754211600000,
//         close_time: 1754211629999,
//         open_price: 113602.99,
//         close_price: 113603.00,
//         high_price: 113603.50,
//         low_price: 113602.50,
//         volume: 0.12345678,
//         quote_volume: 14000.50,
//         number_of_trades: 150,
//         second: 0,
//         klines_count: 30,
//       }
//     ])
//   }

//   const handleEmitBinance30sStats = () => {
//     emitBinance30sStatsUpdated({
//       total_candles: 20160,
//       earliest_time: 1754167832000,
//       latest_time: 1754167932000,
//       avg_close_price: "113602.99",
//       max_high_price: "113650.00",
//       min_low_price: "113550.00",
//       total_volume: "1234.56789012"
//     })
//   }

//   const handleEmitBinance30sLatest = () => {
//     emitBinance30sLatestUpdated([
//       {
//         key: "2025-01-03-15-30-0",
//         symbol: "BTCUSDT",
//         interval: "30s",
//         open_time: 1754211600000,
//         close_time: 1754211629999,
//         open_price: 113602.99,
//         close_price: 113603.00,
//         high_price: 113603.50,
//         low_price: 113602.50,
//         volume: 0.12345678,
//         quote_volume: 14000.50,
//         number_of_trades: 150,
//         second: 0,
//         klines_count: 30,
//       }
//     ])
//   }

//   const handleTriggerError = () => {
//     emitError("Test error message", "test-component")
//   }

//   return (
//     <div className="p-4 space-y-2">
//       <h3 className="font-semibold">Event Sender (Test)</h3>
//       <div className="space-x-2">
//         <button 
//           onClick={handleEmitBinance30sCandles}
//           className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
//         >
//           Emit Candles
//         </button>
//         <button 
//           onClick={handleEmitBinance30sStats}
//           className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//         >
//           Emit Stats
//         </button>
//         <button 
//           onClick={handleEmitBinance30sLatest}
//           className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
//         >
//           Emit Latest
//         </button>
//         <button 
//           onClick={handleTriggerError}
//           className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//         >
//           Trigger Error
//         </button>
//       </div>
//     </div>
//   )
// }

// Component tổng hợp để sử dụng trong app
export const StoreEventManager: React.FC = () => {
  const { fetchCandles, fetchStats,  } = useBinance30sStore()

  return (
    <>
      <ErrorListener />
      <Binance30sCandlesListener />
      <Binance30sStatsListener />
      <Binance30sLatestListener />
      <Binance30sRealtimeListener />
      
      {/* Auto-refresh example */}
      {/* <div className="p-4">
        <h3 className="font-semibold mb-2">Auto Refresh Example</h3>
        <div className="space-x-2">
          <button 
            onClick={() => fetchCandles({ symbol: "BTCUSDT", limit: 10000 })}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Fetch Candles
          </button>
          <button 
            onClick={() => fetchStats("BTCUSDT")}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Fetch Stats
          </button>
        </div>
      </div> */}
    </>
  )
}
