// Export all stores
import { useBinance30sStore } from "./binance-30s-store"
import { useWalletStore } from "./wallet-store"
import { useAuthStore } from "./auth-store"

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
  useWalletBalanceEvents,
  useWalletTransactionsEvents,
  useWalletDepositEvents,
  useWalletWithdrawalEvents,
  useWalletTransferEvents,
  useUserLoggedInEvents,
  useUserLoggedOutEvents,
  useErrorEvents,
  useAllStoreEvents,
} from "./use-store-events"

export {
  useBinance30sStore,
  useWalletStore,
  useAuthStore,
}

export const clearAllStores = () => {
  useBinance30sStore.getState().clearAll()
  useWalletStore.getState().clearAll()
  useAuthStore.getState().clearAll()
}
