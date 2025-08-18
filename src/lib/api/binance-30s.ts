import { AxiosResponse } from "axios"
import apiClient from "../api"

// Types cho Binance 30s candles
export interface Binance30sCandle {
  key: string
  symbol: string
  interval: string
  open_time: number
  close_time: number
  open_price: number
  close_price: number
  high_price: number
  low_price: number
  volume: number
  quote_volume: number
  number_of_trades: number
  second: number
  klines_count: number
}

export interface Binance30sStats {
  total_candles: number
  earliest_time: number
  latest_time: number
  avg_close_price: string
  max_high_price: string
  min_low_price: string
  total_volume: string
}

// Types cho Candle Tables
export interface CandleTable {
  table_index: number
  table_key: string
  start_time: number
  end_time: number
  start_time_formatted: string
  end_time_formatted: string
  candles_count: number
  candles: Binance30sCandle[]
  open_price: number
  close_price: number
  high_price: number
  low_price: number
  total_volume: number
  total_quote_volume: number
  total_trades: number
  has_incomplete_candles: boolean
  incomplete_candles_count: number
}

// ==================== BINANCE 30S API ====================
export const binance30sAPI = {
  // Lấy danh sách nến 30s
  getCandles: async (params: {
    symbol?: string
    start_time?: number
    end_time?: number
    limit?: number
  } = {}): Promise<Binance30sCandle[]> => {
    const response: AxiosResponse = await apiClient.get("/binance/30s/candles", {
      params: {
        symbol: params.symbol || "BTCUSDT",
        ...(params.start_time && { start_time: params.start_time }),
        ...(params.end_time && { end_time: params.end_time }),
        limit: params.limit || 1000,
      },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy dữ liệu nến 30s thất bại")
    return response.data.data
  },

  // Lấy thống kê nến 30s
  getStats: async (symbol: string = "BTCUSDT"): Promise<Binance30sStats> => {
    const response: AxiosResponse = await apiClient.get("/binance/30s/candles/stats", {
      params: { symbol },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy thống kê nến 30s thất bại")
    return response.data.data
  },

  // Lấy nến 30s gần nhất
  getLatestCandles: async (params: {
    symbol?: string
    count?: number
  } = {}): Promise<Binance30sCandle[]> => {
    const response: AxiosResponse = await apiClient.get("/binance/30s/candles/latest", {
      params: {
        symbol: params.symbol || "BTCUSDT",
        count: params.count || 10,
      },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy nến 30s gần nhất thất bại")
    return response.data.data
  },

  // Lấy 5 bảng nến gần nhất
  getCandleTables: async (symbol: string = "BTCUSDT"): Promise<CandleTable[]> => {
    const response: AxiosResponse = await apiClient.get("/binance/30s/tables", {
      params: { symbol },
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy bảng nến thất bại")
    return response.data.data
  },
} 