import { AxiosResponse } from "axios"
import apiClient from "../api"

// Types cho Betting Order
export interface BettingOrder {
  id: number
  symbol: string
  order_type: 'BUY' | 'SELL'
  amount: number
  mode: 'real' | 'demo'
  kline_open_time: number
  kline_close_time: number
  open_price: number
  status: 'PENDING' | 'WIN' | 'LOSE' | 'CANCELLED' | 'ACTIVE' | 'COMPLETED'
  created_at: string
  completed_at?: string
  result?: number
  payout_amount?: number
  close_price?: number
}

// Types cho Place Order Request
export interface PlaceOrderRequest {
  symbol: string
  order_type: 'BUY' | 'SELL'
  amount: number
  mode: 'real' | 'demo'
}

// Types cho Place Order Response
export interface PlaceOrderResponse {
  order: BettingOrder
  message: string
}

// Types cho Active Orders Response
export interface ActiveOrdersResponse {
  orders: BettingOrder[]
}

// Types cho Betting History Response
export interface BettingHistoryResponse {
  orders: BettingOrder[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Types cho Current Kline Info
export interface CurrentKlineInfo {
  symbol: string
  open_price: number
  current_price: number
  kline_open_time: number
  kline_close_time: number
  time_left: number
  can_bet: boolean
  betting_phase: 'betting' | 'waiting'
}

// Types cho Get Active Orders Params
export interface GetActiveOrdersParams {
  mode?: 'real' | 'demo'
  symbol?: string
}

// Types cho Get Betting History Params
export interface GetBettingHistoryParams {
  mode?: 'real' | 'demo'
  symbol?: string
  page?: number
  limit?: number
}

// Types cho Get Current Kline Params
export interface GetCurrentKlineParams {
  symbol?: string
}

// ==================== BETTING API ====================
export const bettingAPI = {
  // Đặt lệnh betting
  placeOrder: async (params: PlaceOrderRequest): Promise<PlaceOrderResponse> => {
    const response: AxiosResponse = await apiClient.post("/betting/place-order", params)
    if (!response.data.success)
      throw new Error(response.data.message || "Đặt lệnh betting thất bại")
    return response.data.data
  },

  // Lấy danh sách lệnh đang chờ
  getActiveOrders: async (params: GetActiveOrdersParams = {}): Promise<ActiveOrdersResponse> => {
    const response: AxiosResponse = await apiClient.get("/betting/active-orders", {
      params
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy danh sách lệnh đang chờ thất bại")
    return response.data.data
  },

  // Lấy lịch sử betting
  getBettingHistory: async (params: GetBettingHistoryParams = {}): Promise<BettingHistoryResponse> => {
    const response: AxiosResponse = await apiClient.get("/betting/history", {
      params
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy lịch sử betting thất bại")
    return response.data.data
  },

  // Lấy thông tin nến hiện tại
  getCurrentKline: async (params: GetCurrentKlineParams = {}): Promise<CurrentKlineInfo> => {
    const response: AxiosResponse = await apiClient.get("/betting/current-kline", {
      params
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy thông tin nến hiện tại thất bại")
    return response.data.data
  }
}
