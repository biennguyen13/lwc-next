// Export all stores
import { useBinance30sStore } from "./binance-30s-store"

// Export store communication utilities
export { 
  useStoreCommunication,
  storeCommunication 
} from "./store-communication"

export {
  useStoreEvents,
  useBinance30sCandlesEvents,
  useBinance30sStatsEvents,
  useBinance30sLatestEvents,
  useErrorEvents,
  useAllStoreEvents,
} from "./use-store-events"

export {
  useBinance30sStore,
}

export const clearAllStores = () => {
  useBinance30sStore.getState().clearAll()
}
