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

// Types cho Betting Statistics
export interface BettingStats {
  date: string
  symbol: string
  total_orders: number
  total_volume: number
  total_income: number
  profit: number
  buy_count: number
  sell_count: number
  buy_percentage: number
  sell_percentage: number
  win_count: number
  loss_count: number
  win_rate: number
}

// Types cho Get Betting Stats Params
export interface GetBettingStatsParams {
  symbol?: string
}

// Types cho Recent Order (từ recent-orders-total-payout API)
export interface RecentOrder {
  id: number
  symbol: string
  order_type: 'BUY' | 'SELL'
  amount: number
  payout_amount: number
  result: number
  open_time: number
  close_time: number
  created_at: string
  completed_at: string
}

// Types cho Recent Orders Total Payout Response
export interface RecentOrdersTotalPayoutResponse {
  total_payout: number
  order_count: number
  orders: RecentOrder[]
}

// Types cho Get Recent Orders Total Payout Params
export interface GetRecentOrdersTotalPayoutParams {
  mode?: 'real' | 'demo'
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
  },

  // Lấy thống kê betting real
  getBettingStats: async (params: GetBettingStatsParams = {}): Promise<BettingStats> => {
    const response: AxiosResponse = await apiClient.get("/betting/stats", {
      params
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy thống kê betting thất bại")
    return response.data.data
  },

  // Lấy tổng payout của các lệnh gần nhất
  getRecentOrdersTotalPayout: async (params: GetRecentOrdersTotalPayoutParams = {}): Promise<RecentOrdersTotalPayoutResponse> => {
    const response: AxiosResponse = await apiClient.get("/betting/recent-orders-total-payout", {
      params
    })
    if (!response.data.success)
      throw new Error(response.data.message || "Lấy tổng payout gần nhất thất bại")
    return response.data.data
  }
}
