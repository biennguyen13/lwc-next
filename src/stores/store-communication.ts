import { useBinance30sStore } from './binance-30s-store'

// Event types để giao tiếp giữa stores
export type StoreEventType = 
  | 'BINANCE_30S_CANDLES_UPDATED'
  | 'BINANCE_30S_STATS_UPDATED'
  | 'BINANCE_30S_LATEST_UPDATED'
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'ERROR_OCCURRED'

export interface StoreEvent {
  type: StoreEventType
  payload?: any
  source: string
  timestamp: number
}

// Event listeners
type EventListener = (event: StoreEvent) => void

class StoreCommunication {
  private listeners: Map<StoreEventType, EventListener[]> = new Map()

  // Đăng ký listener
  subscribe(eventType: StoreEventType, listener: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(listener)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType)
      if (listeners) {
        const index = listeners.indexOf(listener)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  // Gửi event
  emit(event: StoreEvent) {
    const listeners = this.listeners.get(event.type)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.error('Error in store event listener:', error)
        }
      })
    }
  }

  // Helper methods để gửi events cụ thể
  emitBinance30sCandlesUpdated(candles: any) {
    this.emit({
      type: 'BINANCE_30S_CANDLES_UPDATED',
      payload: candles,
      source: 'binance-30s-store',
      timestamp: Date.now()
    })
  }

  emitBinance30sStatsUpdated(stats: any) {
    this.emit({
      type: 'BINANCE_30S_STATS_UPDATED',
      payload: stats,
      source: 'binance-30s-store',
      timestamp: Date.now()
    })
  }

  emitBinance30sLatestUpdated(latestCandles: any) {
    this.emit({
      type: 'BINANCE_30S_LATEST_UPDATED',
      payload: latestCandles,
      source: 'binance-30s-store',
      timestamp: Date.now()
    })
  }

  emitError(error: string, source: string) {
    this.emit({
      type: 'ERROR_OCCURRED',
      payload: { error, source },
      source,
      timestamp: Date.now()
    })
  }
}

// Singleton instance
export const storeCommunication = new StoreCommunication()

// Hook để sử dụng store communication
export const useStoreCommunication = () => {
  return {
    subscribe: storeCommunication.subscribe.bind(storeCommunication),
    emit: storeCommunication.emit.bind(storeCommunication),
    emitBinance30sCandlesUpdated: storeCommunication.emitBinance30sCandlesUpdated.bind(storeCommunication),
    emitBinance30sStatsUpdated: storeCommunication.emitBinance30sStatsUpdated.bind(storeCommunication),
    emitBinance30sLatestUpdated: storeCommunication.emitBinance30sLatestUpdated.bind(storeCommunication),
    emitError: storeCommunication.emitError.bind(storeCommunication),
  }
} 