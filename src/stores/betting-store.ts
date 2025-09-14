import { create } from "zustand"
import { 
  bettingAPI, 
  BettingOrder, 
  PlaceOrderRequest,
  PlaceOrderResponse,
  ActiveOrdersResponse,
  BettingHistoryResponse,
  CurrentKlineInfo,
  GetActiveOrdersParams,
  GetBettingHistoryParams,
  GetCurrentKlineParams
} from "@/lib/api/betting"
import { storeCommunication } from "./store-communication"

interface BettingStoreState {
  // Data
  activeOrders: BettingOrder[]
  bettingHistory: BettingOrder[]
  currentKline: CurrentKlineInfo | null
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  } | null
  
  // Loading states
  activeOrdersLoading: boolean
  bettingHistoryLoading: boolean
  currentKlineLoading: boolean
  placeOrderLoading: boolean
  
  // Error states
  activeOrdersError: string | null
  bettingHistoryError: string | null
  currentKlineError: string | null
  placeOrderError: string | null
  
  // Actions
  fetchActiveOrders: (params?: GetActiveOrdersParams) => Promise<void>
  fetchBettingHistory: (params?: GetBettingHistoryParams) => Promise<void>
  fetchCurrentKline: (params?: GetCurrentKlineParams) => Promise<void>
  placeOrder: (params: PlaceOrderRequest) => Promise<PlaceOrderResponse>
  
  // Refresh actions (without loading states for auto-refresh)
  refreshActiveOrders: (params?: GetActiveOrdersParams) => Promise<void>
  refreshBettingHistory: (params?: GetBettingHistoryParams) => Promise<void>
  refreshCurrentKline: (params?: GetCurrentKlineParams) => Promise<void>
  
  // Clear errors
  clearActiveOrdersError: () => void
  clearBettingHistoryError: () => void
  clearCurrentKlineError: () => void
  clearPlaceOrderError: () => void
  
  // Clear all
  clearAll: () => void
}

export const useBettingStore = create<BettingStoreState>((set, get) => ({
  // Initial state
  activeOrders: [],
  bettingHistory: [],
  currentKline: null,
  pagination: null,
  
  // Loading states
  activeOrdersLoading: false,
  bettingHistoryLoading: false,
  currentKlineLoading: false,
  placeOrderLoading: false,
  
  // Error states
  activeOrdersError: null,
  bettingHistoryError: null,
  currentKlineError: null,
  placeOrderError: null,
  
  // Fetch active orders
  fetchActiveOrders: async (params = {}) => {
    set({ activeOrdersLoading: true, activeOrdersError: null })
    try {
      const result = await bettingAPI.getActiveOrders(params)
      set({ 
        activeOrders: result.orders, 
        activeOrdersLoading: false 
      })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingActiveOrdersUpdated(result.orders)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        activeOrdersError: errorMessage,
        activeOrdersLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'betting-store')
    }
  },

  // Fetch betting history
  fetchBettingHistory: async (params = {}) => {
    set({ bettingHistoryLoading: true, bettingHistoryError: null })
    try {
      const result = await bettingAPI.getBettingHistory(params)
      set({ 
        bettingHistory: result.orders,
        pagination: result.pagination,
        bettingHistoryLoading: false 
      })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingHistoryUpdated(result.orders)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        bettingHistoryError: errorMessage,
        bettingHistoryLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'betting-store')
    }
  },

  // Fetch current kline info
  fetchCurrentKline: async (params = {}) => {
    set({ currentKlineLoading: true, currentKlineError: null })
    try {
      const currentKline = await bettingAPI.getCurrentKline(params)
      set({ currentKline, currentKlineLoading: false })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingKlineUpdated(currentKline)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        currentKlineError: errorMessage,
        currentKlineLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'betting-store')
    }
  },

  // Place betting order
  placeOrder: async (params) => {
    set({ placeOrderLoading: true, placeOrderError: null })
    try {
      const result = await bettingAPI.placeOrder(params)
      
      // Emit event để thông báo order đã được tạo
      storeCommunication.emitBettingOrderPlaced(result.order)
      
      // Refresh active orders after successful order placement
      // await get().fetchActiveOrders({ mode: params.mode })
      
      set({ placeOrderLoading: false })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
      set({ 
        placeOrderError: errorMessage,
        placeOrderLoading: false 
      })
      
      // Emit error event
      storeCommunication.emitError(errorMessage, 'betting-store')
      throw error // Re-throw to let component handle it
    }
  },

  // Refresh active orders without loading state (for auto-refresh)
  refreshActiveOrders: async (params = {}) => {
    try {
      const result = await bettingAPI.getActiveOrders(params)
      set({ activeOrders: result.orders })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingActiveOrdersUpdated(result.orders)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh active orders failed:', error)
    }
  },

  // Refresh betting history without loading state (for auto-refresh)
  refreshBettingHistory: async (params = {}) => {
    try {
      const result = await bettingAPI.getBettingHistory(params)
      set({ 
        bettingHistory: result.orders,
        pagination: result.pagination
      })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingHistoryUpdated(result.orders)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh betting history failed:', error)
    }
  },

  // Refresh current kline without loading state (for auto-refresh)
  refreshCurrentKline: async (params = {}) => {
    try {
      const currentKline = await bettingAPI.getCurrentKline(params)
      set({ currentKline })
      
      // Emit event để thông báo cho các components khác
      storeCommunication.emitBettingKlineUpdated(currentKline)
    } catch (error) {
      // Silent error for auto-refresh - don't show loading or error states
      console.warn('Auto-refresh current kline failed:', error)
    }
  },

  // Clear errors
  clearActiveOrdersError: () => set({ activeOrdersError: null }),
  clearBettingHistoryError: () => set({ bettingHistoryError: null }),
  clearCurrentKlineError: () => set({ currentKlineError: null }),
  clearPlaceOrderError: () => set({ placeOrderError: null }),
  
  // Clear all
  clearAll: () => set({
    activeOrders: [],
    bettingHistory: [],
    currentKline: null,
    pagination: null,
    activeOrdersLoading: false,
    bettingHistoryLoading: false,
    currentKlineLoading: false,
    placeOrderLoading: false,
    activeOrdersError: null,
    bettingHistoryError: null,
    currentKlineError: null,
    placeOrderError: null,
  }),
}))
