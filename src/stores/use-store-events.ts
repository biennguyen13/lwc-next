"use client"

import { useEffect } from "react"
import {
  useStoreCommunication,
  StoreEventType,
  StoreEvent,
} from "./store-communication"

// Hook để lắng nghe store events
export const useStoreEvents = (
  eventType: StoreEventType,
  callback: (event: any) => void,
  dependencies: any[] = []
) => {
  const { subscribe } = useStoreCommunication()

  useEffect(() => {
    const unsubscribe = subscribe(eventType, callback)
    return unsubscribe
  }, [eventType, ...dependencies])
}

// Hook để lắng nghe Binance 30s candles events
export const useBinance30sCandlesEvents = (callback: (candles: any) => void) => {
  return useStoreEvents("BINANCE_30S_CANDLES_UPDATED", callback)
}

// Hook để lắng nghe Binance 30s stats events
export const useBinance30sStatsEvents = (callback: (stats: any) => void) => {
  return useStoreEvents("BINANCE_30S_STATS_UPDATED", callback)
}

// Hook để lắng nghe Binance 30s latest candles events
export const useBinance30sLatestEvents = (callback: (latestCandles: any) => void) => {
  return useStoreEvents("BINANCE_30S_LATEST_UPDATED", callback)
}

// Hook để lắng nghe wallet events
export const useWalletBalanceEvents = (callback: (balance: any) => void) => {
  return useStoreEvents("WALLET_BALANCE_UPDATED", callback)
}

export const useWalletTransactionsEvents = (callback: (transactions: any) => void) => {
  return useStoreEvents("WALLET_TRANSACTIONS_UPDATED", callback)
}

export const useWalletDepositEvents = (callback: (deposit: any) => void) => {
  return useStoreEvents("WALLET_DEPOSIT_CREATED", callback)
}

export const useWalletWithdrawalEvents = (callback: (withdrawal: any) => void) => {
  return useStoreEvents("WALLET_WITHDRAWAL_CREATED", callback)
}

export const useWalletTransferEvents = (callback: (transfer: any) => void) => {
  return useStoreEvents("WALLET_TRANSFER_COMPLETED", callback)
}

// Hook để lắng nghe betting events
export const useBettingActiveOrdersEvents = (callback: (orders: any) => void) => {
  return useStoreEvents("BETTING_ACTIVE_ORDERS_UPDATED", callback)
}

export const useBettingHistoryEvents = (callback: (orders: any) => void) => {
  return useStoreEvents("BETTING_HISTORY_UPDATED", callback)
}

export const useBettingKlineEvents = (callback: (kline: any) => void) => {
  return useStoreEvents("BETTING_KLINE_UPDATED", callback)
}

export const useBettingOrderPlacedEvents = (callback: (order: any) => void) => {
  return useStoreEvents("BETTING_ORDER_PLACED", callback)
}

// Hook để lắng nghe error events
export const useErrorEvents = (callback: (error: any) => void) => {
  return useStoreEvents("ERROR_OCCURRED", callback)
}

// Hook để lắng nghe auth events
export const useUserLoggedInEvents = (callback: (user: any) => void) => {
  return useStoreEvents("USER_LOGGED_IN", callback)
}

export const useUserLoggedOutEvents = (callback: () => void) => {
  return useStoreEvents("USER_LOGGED_OUT", callback)
}

// Hook để lắng nghe tất cả events
export const useAllStoreEvents = (callback: (event: any) => void) => {
  const { subscribe } = useStoreCommunication()

  useEffect(() => {
    const eventTypes: StoreEventType[] = [
      "BINANCE_30S_CANDLES_UPDATED",
      "BINANCE_30S_STATS_UPDATED",
      "BINANCE_30S_LATEST_UPDATED",
      "WALLET_BALANCE_UPDATED",
      "WALLET_TRANSACTIONS_UPDATED",
      "WALLET_DEPOSIT_CREATED",
      "WALLET_WITHDRAWAL_CREATED",
      "WALLET_TRANSFER_COMPLETED",
      "BETTING_ACTIVE_ORDERS_UPDATED",
      "BETTING_HISTORY_UPDATED",
      "BETTING_KLINE_UPDATED",
      "BETTING_ORDER_PLACED",
      "USER_LOGGED_IN",
      "USER_LOGGED_OUT",
      "ERROR_OCCURRED",
    ]

    const unsubscribes = eventTypes.map((eventType) =>
      subscribe(eventType, callback)
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [callback])
}
