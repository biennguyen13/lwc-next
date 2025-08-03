import { create } from "zustand"
import { binance30sAPI, Binance30sCandle, Binance30sStats } from "@/lib/api/binance-30s"
import { storeCommunication } from "./store-communication"

interface Binance30sStoreState {
  // Data
  candles: Binance30sCandle[] | null
  stats: Binance30sStats | null
  latestCandles: Binance30sCandle[] | null
  
  // Loading states
  candlesLoading: boolean
  statsLoading: boolean
  latestCandlesLoading: boolean
  
  // Error states
  candlesError: string | null
  statsError: string | null
  latestCandlesError: string | null
  
  // Actions
  fetchCandles: (params?: {
    symbol?: string
    start_time?: number
    end_time?: number
    limit?: number
  }) => Promise<void>
  fetchStats: (symbol?: string) => Promise<void>
  fetchLatestCandles: (params?: { symbol?: string; count?: number }) => Promise<void>
  clearCandlesError: () => void
  clearStatsError: () => void
  clearLatestCandlesError: () => void
  clearAll: () => void
}

export const useBinance30sStore = create<Binance30sStoreState>((set) => ({
  // Initial state
  candles: null,
  stats: null,
  latestCandles: null,
  candlesLoading: false,
  statsLoading: false,
  latestCandlesLoading: false,
  candlesError: null,
  statsError: null,
  latestCandlesError: null,

  // Fetch candles
  fetchCandles: async (params = {}) => {
    set({ candlesLoading: true, candlesError: null })
    try {
      const data = await binance30sAPI.getCandles(params)
      set({ candles: data, candlesLoading: false })
      
      // Emit event khi fetch candles thành công
      storeCommunication.emitBinance30sCandlesUpdated(data)
    } catch (error: any) {
      set({
        candlesLoading: false,
        candlesError: error?.message || "Lấy dữ liệu nến 30s thất bại",
      })
    }
  },

  // Fetch stats
  fetchStats: async (symbol = "BTCUSDT") => {
    set({ statsLoading: true, statsError: null })
    try {
      const data = await binance30sAPI.getStats(symbol)
      set({ stats: data, statsLoading: false })
      
      // Emit event khi fetch stats thành công
      storeCommunication.emitBinance30sStatsUpdated(data)
    } catch (error: any) {
      set({
        statsLoading: false,
        statsError: error?.message || "Lấy thống kê nến 30s thất bại",
      })
    }
  },

  // Fetch latest candles
  fetchLatestCandles: async (params = {}) => {
    set({ latestCandlesLoading: true, latestCandlesError: null })
    try {
      const data = await binance30sAPI.getLatestCandles(params)
      set({ latestCandles: data, latestCandlesLoading: false })
      
      // Emit event khi fetch latest candles thành công
      storeCommunication.emitBinance30sLatestUpdated(data)
    } catch (error: any) {
      set({
        latestCandlesLoading: false,
        latestCandlesError: error?.message || "Lấy nến 30s gần nhất thất bại",
      })
    }
  },

  // Clear errors
  clearCandlesError: () => set({ candlesError: null }),
  clearStatsError: () => set({ statsError: null }),
  clearLatestCandlesError: () => set({ latestCandlesError: null }),

  // Clear all
  clearAll: () => {
    set({
      candles: null,
      stats: null,
      latestCandles: null,
      candlesLoading: false,
      statsLoading: false,
      latestCandlesLoading: false,
      candlesError: null,
      statsError: null,
      latestCandlesError: null,
    })
  },
})) 