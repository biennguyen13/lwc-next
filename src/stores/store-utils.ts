// Store utilities to avoid circular imports
import { useBinance30sStore } from "./binance-30s-store"
import { useWalletStore } from "./wallet-store"
import { useAuthStore } from "./auth-store"
import { useBettingStore } from "./betting-store"

/**
 * Clear all stores - useful for logout functionality
 * This function clears all state from all stores
 */
export const clearAllStores = () => {
  useBinance30sStore.getState().clearAll()
  useWalletStore.getState().clearAll()
  useAuthStore.getState().clearAll()
  useBettingStore.getState().clearAll()
}
