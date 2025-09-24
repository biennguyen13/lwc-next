import { useBinance30sStore } from './binance-30s-store'

// Event types để giao tiếp giữa stores
export type StoreEventType = 
  | 'BINANCE_30S_CANDLES_UPDATED'
  | 'BINANCE_30S_STATS_UPDATED'
  | 'BINANCE_30S_LATEST_UPDATED'
  | 'BINANCE_30S_TABLES_UPDATED'
  | 'BINANCE_30S_REALTIME_UPDATED'
  | 'WALLET_BALANCE_UPDATED'
  | 'WALLET_TRANSACTIONS_UPDATED'
  | 'WALLET_DEPOSIT_CREATED'
  | 'WALLET_WITHDRAWAL_CREATED'
  | 'WALLET_TRANSFER_COMPLETED'
  | 'BETTING_ACTIVE_ORDERS_UPDATED'
  | 'BETTING_HISTORY_UPDATED'
  | 'BETTING_KLINE_UPDATED'
  | 'BETTING_STATS_UPDATED'
  | 'BETTING_RECENT_ORDERS_TOTAL_PAYOUT_UPDATED'
  | 'BETTING_ORDER_PLACED'
  | 'BETTING_MODE_CHANGED'
  | 'DEMO_BALANCE_RESET'
  | 'USER_LOGGED_IN'
  | 'USER_LOGGED_OUT'
  | 'TWO_FA_STATUS_UPDATED'
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

  emitBinance30sTablesUpdated(tables: any) {
    this.emit({
      type: 'BINANCE_30S_TABLES_UPDATED',
      payload: tables,
      source: 'binance-30s-store',
      timestamp: Date.now()
    })
  }

  emitBinance30sRealtimeUpdated(realtimeData: any) {
    this.emit({
      type: 'BINANCE_30S_REALTIME_UPDATED',
      payload: realtimeData,
      source: 'binance-30s-store',
      timestamp: Date.now()
    })
  }

  // Wallet events
  emitWalletBalanceUpdated(balance: any) {
    this.emit({
      type: 'WALLET_BALANCE_UPDATED',
      payload: balance,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  emitWalletTransactionsUpdated(transactions: any) {
    this.emit({
      type: 'WALLET_TRANSACTIONS_UPDATED',
      payload: transactions,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  emitWalletDepositCreated(deposit: any) {
    this.emit({
      type: 'WALLET_DEPOSIT_CREATED',
      payload: deposit,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  emitWalletWithdrawalCreated(withdrawal: any) {
    this.emit({
      type: 'WALLET_WITHDRAWAL_CREATED',
      payload: withdrawal,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  emitWalletTransferCompleted(transfer: any) {
    this.emit({
      type: 'WALLET_TRANSFER_COMPLETED',
      payload: transfer,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  // Betting events
  emitBettingActiveOrdersUpdated(orders: any[]) {
    this.emit({
      type: 'BETTING_ACTIVE_ORDERS_UPDATED',
      payload: orders,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingHistoryUpdated(orders: any[]) {
    this.emit({
      type: 'BETTING_HISTORY_UPDATED',
      payload: orders,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingKlineUpdated(kline: any) {
    this.emit({
      type: 'BETTING_KLINE_UPDATED',
      payload: kline,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingOrderPlaced(order: any) {
    this.emit({
      type: 'BETTING_ORDER_PLACED',
      payload: order,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingStatsUpdated(stats: any) {
    this.emit({
      type: 'BETTING_STATS_UPDATED',
      payload: stats,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingRecentOrdersTotalPayoutUpdated(recentOrdersTotalPayout: any) {
    this.emit({
      type: 'BETTING_RECENT_ORDERS_TOTAL_PAYOUT_UPDATED',
      payload: recentOrdersTotalPayout,
      source: 'betting-store',
      timestamp: Date.now()
    })
  }

  emitBettingModeChanged(mode: 'real' | 'demo') {
    this.emit({
      type: 'BETTING_MODE_CHANGED',
      payload: mode,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  emitDemoBalanceReset(result: any) {
    this.emit({
      type: 'DEMO_BALANCE_RESET',
      payload: result,
      source: 'wallet-store',
      timestamp: Date.now()
    })
  }

  // Auth events
  emitUserLoggedIn(user: any) {
    this.emit({
      type: 'USER_LOGGED_IN',
      payload: user,
      source: 'auth-store',
      timestamp: Date.now()
    })
  }

  emitUserLoggedOut() {
    this.emit({
      type: 'USER_LOGGED_OUT',
      payload: null,
      source: 'auth-store',
      timestamp: Date.now()
    })
  }

  // 2FA events
  emit2FAStatusUpdated(enabled: boolean) {
    this.emit({
      type: 'TWO_FA_STATUS_UPDATED',
      payload: { enabled },
      source: 'two-factor-store',
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
    emitBinance30sTablesUpdated: storeCommunication.emitBinance30sTablesUpdated.bind(storeCommunication),
    emitBinance30sRealtimeUpdated: storeCommunication.emitBinance30sRealtimeUpdated.bind(storeCommunication),
    emitWalletBalanceUpdated: storeCommunication.emitWalletBalanceUpdated.bind(storeCommunication),
    emitWalletTransactionsUpdated: storeCommunication.emitWalletTransactionsUpdated.bind(storeCommunication),
    emitWalletDepositCreated: storeCommunication.emitWalletDepositCreated.bind(storeCommunication),
    emitWalletWithdrawalCreated: storeCommunication.emitWalletWithdrawalCreated.bind(storeCommunication),
    emitWalletTransferCompleted: storeCommunication.emitWalletTransferCompleted.bind(storeCommunication),
    emitBettingActiveOrdersUpdated: storeCommunication.emitBettingActiveOrdersUpdated.bind(storeCommunication),
    emitBettingHistoryUpdated: storeCommunication.emitBettingHistoryUpdated.bind(storeCommunication),
    emitBettingKlineUpdated: storeCommunication.emitBettingKlineUpdated.bind(storeCommunication),
    emitBettingStatsUpdated: storeCommunication.emitBettingStatsUpdated.bind(storeCommunication),
    emitBettingRecentOrdersTotalPayoutUpdated: storeCommunication.emitBettingRecentOrdersTotalPayoutUpdated.bind(storeCommunication),
    emitBettingOrderPlaced: storeCommunication.emitBettingOrderPlaced.bind(storeCommunication),
    emitBettingModeChanged: storeCommunication.emitBettingModeChanged.bind(storeCommunication),
    emitDemoBalanceReset: storeCommunication.emitDemoBalanceReset.bind(storeCommunication),
    emitUserLoggedIn: storeCommunication.emitUserLoggedIn.bind(storeCommunication),
    emitUserLoggedOut: storeCommunication.emitUserLoggedOut.bind(storeCommunication),
    emit2FAStatusUpdated: storeCommunication.emit2FAStatusUpdated.bind(storeCommunication),
    emitError: storeCommunication.emitError.bind(storeCommunication),
  }
} 