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

// Hook để lắng nghe error events
export const useErrorEvents = (callback: (error: any) => void) => {
  return useStoreEvents("ERROR_OCCURRED", callback)
}

// Hook để lắng nghe tất cả events
export const useAllStoreEvents = (callback: (event: any) => void) => {
  const { subscribe } = useStoreCommunication()

  useEffect(() => {
    const eventTypes: StoreEventType[] = [
      "BINANCE_30S_CANDLES_UPDATED",
      "BINANCE_30S_STATS_UPDATED",
      "BINANCE_30S_LATEST_UPDATED",
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
